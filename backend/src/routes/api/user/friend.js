import express from "express";
import { Friend } from "#db/friend.schema";
import { asyncHandler } from "../../../utils.js";

const router = express.Router();

// Get all friends of the current user
router.get('/', asyncHandler(async (req, res) => {
  const friends = await Friend.find({userId: req.userId});
  res.json(friends);
}));

// Create a new friend
router.post('/', asyncHandler(async (req, res) => {
  console.log("Received request to create a new profile:", req.body);
  const friendData = req.body;
  const newFriend = new Friend({
    userId: req.userId,
    name: friendData.name,
    gender: friendData.gender,
    birthday: new Date(friendData.birthday),
    relationship: friendData.relationship,
    // customRelationship: friendData.customRelationship,
    mbtiType: friendData.mbtiType,
    hobbies: friendData.hobbies,
    skills: friendData.skills,
    preferences: {
      likes: friendData.preferences.likes,
      dislikes: friendData.preferences.dislikes
    }
  });
  await newFriend.save();
  res.status(201).json(newFriend);
}));

// Delete a friend
router.delete('/:id', asyncHandler(async (req, res) => {
  try {
    // console.log('Received request to delete friend with id:', req.params.id);
    const friend = await Friend.findById(req.params.id);
    // console.log('Friend:', friend);
    if (!friend) {
      // console.log('Friend not found');
      return res.status(404).send('Friend not found');
    }
    // console.log('Deleting friend');
    await friend.deleteFriend();
    console.log('Friend deleted successfully');
    res.send('Friend deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting friend');
  }
}));

// Get a friend by id
router.get('/:id', async (req, res) => {
  try {
      const friend = await Friend.findById(req.params.id);
      if (!friend) {
          return res.status(404).send('Friend not found');
      }
      res.json(friend);
  } catch (error) {
      res.status(500).send('Internal Server Error');
  }
});

// Edit a friend
router.put('/:id', async (req, res)  => {
  console.log('Received request to update friend with id:', req.params.id);
  try {
      const friend = await Friend.findById(req.params.id);
      console.log('Friend:', friend);
      if (!friend) {
          return res.status(404).send('Friend not found');
      }
      friend.name = req.body.name || friend.name;
      friend.gender = req.body.gender || friend.gender;
      friend.birthday = req.body.birthday ? new Date(req.body.birthday) : friend.birthday;
      friend.relationship = req.body.relationship || friend.relationship;
      // friend.customRelationship = req.body.customRelationship || friend.customRelationship;
      friend.mbtiType = req.body.mbtiType || friend.mbtiType;
      friend.hobbies = req.body.hobbies || friend.hobbies;
      friend.skills = req.body.skills || friend.skills;
      if (req.body.preferences) {
        friend.preferences.likes = req.body.preferences.likes || friend.preferences.likes;
        friend.preferences.dislikes = req.body.preferences.dislikes || friend.preferences.dislikes;
      }         
      console.log('Updated friend:', friend);
      await friend.save(); 
      console.log('Friend updated successfully');
      res.json(friend); 
  } catch (error) {
      res.status(500).send('Error updating friend: ' + error.message);
  }
});


export default router;