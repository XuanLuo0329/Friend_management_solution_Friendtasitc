import dotenv from "dotenv";
dotenv.config();

import verifyJWT from "#middleware/JWTAuth";
import express from "express";
import OpenAI from "openai";
import { asyncHandler } from "../../../utils.js";
import { Friend } from "#db/friend.schema";


const apiKey = process.env.OPEN_API_KEY;
if (!apiKey) {
    throw new Error("The OPEN_API_KEY envrionment variable is missing!");
}

const router = express.Router();
const openai = new OpenAI({ apiKey });


router.post('/eventRecommendation', verifyJWT(), async (req, res) => {
    const question = req.body.question;
    const userId = req.userId;

    try {
        const profiles = await Friend.getAllFriendsByUserId(userId);

        if (profiles.length < 2) {
            return res.status(400).json({ error: 'Not enough friends data available to make a recommendation. At least two friends are needed.' });
        }

        const friendsDescriptions = profiles.map(profile => {
            const hobbiesText = profile.hobbies.join(', ');
            const likesText = profile.preferences.likes.join(', ');
            const dislikesText = profile.preferences.dislikes.join(', ');

            return `Name: ${profile.name}, Gender: ${profile.gender}, Relationship: ${profile.relationship}, MBTI Type: ${profile.mbtiType}, Hobbies: ${hobbiesText}, Likes: ${likesText}, Dislikes: ${dislikesText}`;
        }).join('; ');

        const assistantDescription = `You are an assistant tasked with helping users decide who to go out with or which event to participate in, based on their friends' information. Here is the information of this user's friends:\n${friendsDescriptions}\nBased on the user's question, please determine whether they are asking about a specific friend or an event. Respond with exactly two recommendations in strict JSON format. Example of expected response format:
        [{"name": "Person or Event Name", "description": "Reasons for recommendation"}].
        If it's about a friend, include the friend's name and reasons for recommendation. If it's about an event, include the event's title and reasons why it is suitable.`;

        const systemMessage = assistantDescription;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: question }
            ],
            temperature: 0.5
        });

        const responses = JSON.parse(completion.choices[0].message.content);
        if (responses.length === 2 && responses.every(r => r.name && r.description)) {
            res.json({ recommendations: responses });
        } else {
            throw new Error("Invalid response format");
        }
    } catch (error) {
        res.status(500).json({ error: "Error processing request, There may have been a fluctuation in your internet connection or an issue with how the question was phrased. Try asking like this: 'Where should I go for fun, and who should I go with?' Or you can ask, 'I want to go out with someone, where should we go?'" });
    }
});


router.post('/gift', asyncHandler(async (req, res) => {

    const { selectedFriend, giftPurpose, budgetMin, budgetMax, specificRequirements } = req.body;

    const systemContent = `You are a helpful assistant specialized in suggesting personalized gifts. Using the following information, 
                           identify the three best gifts for the user. Please provide reasons for each choice and specify the type 
                           of purchase location for each gift, such as a supermarket, an online marketplace, or a specialty store, 
                           but not limited to these examples.\n
                           User's relationship with the gift receiver is ${selectedFriend.relationship}, and receiver's information are:\n
                           Gender: ${selectedFriend.gender},
                           MBTI: ${selectedFriend.mbtiType},
                           Hobbies: ${selectedFriend.hobbies.join(', ')},
                           Skills: ${selectedFriend.skills.join(', ')},
                           Likes: ${selectedFriend.preferences.likes.join(', ')},
                           Dislikes: ${selectedFriend.preferences.dislikes.join(', ')}
                           Please format the answer in JSON as follows:
                           {
                            "Gifts": [{"giftName": "Example Gift 1",
                                       "reasons": "Reason why this gift is suitable based on user preferences",
                                       "purchasePlace": "Online Marketplace (e.g., Amazon)"
                                      },
                                      {
                                       "giftName": "Example Gift 2",
                                       "reasons": "Reason why this gift is suitable based on user preferences",
                                       "purchasePlace": "Local Artisan Shop"
                                      },
                                      {
                                       "giftName": "Example Gift 3",
                                       "reasons": "Reason why this gift is suitable based on user preferences",
                                       "purchasePlace": "National Chain Store"
                            }]}`;

    const userContent = `Please strictly follow the criteria below:\n
                         Gift Purpose: ${giftPurpose},
                         Minimum Budget: ${budgetMin} NZD,
                         Maximum Budget: ${budgetMax} NZD,
                         Specific Requirements: ${specificRequirements}
                        `
    
    try{
        const textResponse = await generateText(systemContent, userContent);
        if (!textResponse) {
            const error = new Error('Insufficient quota!');
            error.statusCode = 429;
            throw error;
        };

        const gifts = JSON.parse(textResponse).Gifts;
        
        const imageResponse = await Promise.all(
            gifts.map((gift) => generateImage(gift))
        );
        
        const finalResponse = gifts.map((gift, index) => ({
            giftName: gift.giftName,
            reasons: gift.reasons,
            purchasePlace: gift.purchasePlace,
            imageUrl: imageResponse[index]
        }));
        res.json({ success: true, response: finalResponse });
    } catch (error){
        console.log(error);
        if (error.statusCode === 429) {
            res.status(429).json({
                status: 429,
                message: "Insufficient quota!"
            });
        } else {
            console.error("Failed to generate content: ", error);
            res.status(500).json({ success: false, message: "Failed to get recommendations from AI." });
        }
    }
}));

async function generateText(systemContent, userContent) {
    try{
        const completion = await openai.chat.completions.create({
            messages: [{ "role": "system", "content": systemContent },
            { "role": "user", "content": userContent }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });
        return completion.choices[0].message.content;
    }catch(error){
        console.log(error);
        console.error("Failed to generate content: ", error);
    }
}

async function generateImage(prompt) {
    try{
        if(!prompt){
            console.error("No prompt provided for image generation.");
            return {error:"No prompt provided."}; 
        }
        const response = await openai.images.generate({
            model: "dall-e-2",
            prompt: prompt.giftName,
            n: 1,
            size: "256x256",
        });

        return response.data[0].url;

    }catch(error){
        if(error.status === 429){
            console.error("Rate limit exceeded, waiting to retry...");
            const retryAfter = error.headers['x-ratelimit-reset-images'];
            setTimeout(generateImage, retryAfter * 1000);
        }else{
            console.error("Failed to generate image: ", error);
            
        } 
        return {error:error.message};
    }
};

export default router;