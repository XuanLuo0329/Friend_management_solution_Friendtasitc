import express from "express";
import { Friend } from "#db/friend.schema";
import { User } from "#db/user.schema";
const router = express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await Friend.find();
        console.log("Fetched users:", users);
        return res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// for testing get userid
router.get('/getAllUsers', async(req, res) => {
    
    try{
        const allUsers = await User.getAllUsers();
        res.json(allUsers);
    }catch (error) {
        res.status(500).json({ error: error.message});
    }
});

export default router;