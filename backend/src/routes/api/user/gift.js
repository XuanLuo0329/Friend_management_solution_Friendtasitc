import express from 'express';
import { Gift } from "#db/gift.schema";
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const gifts = await Gift.find({ userId: req.userId });
        res.json(gifts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all gifts for a user's friend
router.get('/:friendId', async (req, res) => {
    try {
        const gifts = await Gift.find({ userId: req.userId, friendId: req.params.friendId});
        res.json(gifts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a gift
router.post('/', async (req, res) => {
    const { friendId, friendName, giftName, reasons, purchasePlace, imageUrl } = req.body;
    const userId = req.userId;
    try {
        const existingGift = await Gift.findOne({ 
            userId, 
            friendId, 
            giftName
        });
        if (existingGift) {
            console.log(existingGift);
            return res.status(409).json({ status: 409, message: 'This gift has already been added.' });
        }

        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        const buffer = await imageResponse.buffer();

        const timestamp = Date.now(); 
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const filename = `${friendId}_${giftName.replace(/ /g, '_')}_${timestamp}.png`;
        const uploadsDir = path.join(__dirname, '../../../../uploads');
        const filePath = path.join(uploadsDir, filename);

        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        fs.writeFileSync(filePath, buffer);

        const httpUrl = `uploads\\${filename}`;

        const gift = new Gift({ userId, friendId, friendName, giftName, reasons, purchasePlace, imageUrl: httpUrl });
        console.log(gift);
        const newGift = await gift.save();
        res.status(201).json(newGift);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove a gift
router.delete('/:id', async (req, res) => {
    try {
        const result = await Gift.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Gift not found' });
        res.json({ message: 'Deleted Gift' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;