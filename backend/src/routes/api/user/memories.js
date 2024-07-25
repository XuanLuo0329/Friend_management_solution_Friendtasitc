import express from "express";
import { Memory } from "#db/memorySchema";//import Memory from memorySchema.js
import { upload } from "#middleware/uploadImage"; //import upload from uploadImage.js
import fs from 'fs';//import fs
import path from 'path';//import path

const router = express.Router();

// GET route to show all memories
router.get('/showAllMemories', async (req, res) => {
    try {
        // Fetch all memories for the current user
        const memories = await Memory.find({ userId: req.userId })// Filter by user ID
                               .sort({ date: -1 }); // Sort by date in descending order
         res.json(memories); // Send the memories as a JSON response
    } catch (error) {
        console.error("Error fetching memories:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST route to create a new memory
router.post('/', upload.single('image'), async (req, res) => {

    console.log('Received title:', req.body.title);
    console.log('Received image:', req.file);
    
    try {
        const { title, tag, date, description } = req.body;
        const userId = req.userId;  // Use userId from token, ensured by JWTAuth middleware
        const imagePath = req.file ? req.file.path : null;  // Get path of the uploaded file
        const memoryData = {
            userId,
            title,
            tag,
            date,
            description,
            image: imagePath
        };
        const newMemory = await createMemory(memoryData);
        res.status(201).json(newMemory);
    } catch (error) {
        console.error("Error creating memory:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route to show a single memory's details
router.get('/:id', async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory) {
            return res.status(404).send('Memory not found');
        }
        res.json(memory);
    } catch (error) {
        console.error("Error fetching memory:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Put route to update a memory
router.put('/:id', upload.single('memoryImage'), async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);
        if (!memory) {
            return res.status(404).send('Memory not found');
        }

        const { title, tag, date, description } = req.body;

        // Overwrite the memory with new data
        memory.title = title;
        memory.tag = tag;
        memory.date = new Date(date);
        memory.description = description;
        req.file?.path && (memory.image = req.file.path);

        const updatedMemory = await memory.save();
        res.json(updatedMemory);
    } catch (error) {
        console.error("Error updating memory:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE route to delete a memory
router.delete('/:id', async (req, res) => {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
        return res.status(404).send('Memory not found');
    }

    // delete the single image file using fs.unlink if there is an image
    if (memory.image) {
        fs.unlink(memory.image, err => {
            if (err) console.log('Failed to delete image:', memory.image);
        });
    }
    
    await memory.deleteOne();
    res.send('Memory and associated image deleted');
});

// a method to create a new memory
async function createMemory(memoryData) {
    try {
       const newMemory = new Memory({
            userId: memoryData.userId,
            title: memoryData.title,
            tag: memoryData.tag,
            date: new Date(memoryData.date),
            description: memoryData.description,
            image: memoryData.image 
        });
        const savedMemory = await newMemory.save();
        console.log('New memory created:', savedMemory);
        return savedMemory;
    } catch (error) {
        console.error('Error creating new memory:', error);
        throw error;
    }
}

export default router;
