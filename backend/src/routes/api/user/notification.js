
import express from "express";
import { Notification } from "#db/notification.schema";
import { asyncHandler } from "../../../utils.js";

const router = express.Router();

router.delete("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (await Notification.findOneAndUpdate({ _id: id, userId: req.userId }, { deleted: true })) {
        return res.status(200).send();
    }
    return res.status(204).send();
}));

router.get("/", asyncHandler(async (req, res) => {
    const notificationList = await Notification.find({userId: req.userId, deleted: false});
    return res.status(200).json(notificationList);
}));

export default router;