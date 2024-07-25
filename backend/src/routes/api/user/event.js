import express from "express";
import { Event } from "#db/event.schema";
import { Notification } from "#db/notification.schema";
import { asyncHandler } from "../../../utils.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
    const newEvent = await Event.create({ userId: req.userId, ...(req.body) });
    return res.status(201).send(newEvent);
}));

router.put("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedEvent = await Event.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, {
        new: true,
        runValidators: true
    })
    if (updatedEvent) {
        await Notification.deleteMany({ userId: req.userId, eventId: id });
        return res.status(200).send(updatedEvent);
    }
    return res.status(204).send();
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (await Event.findOneAndDelete({ _id: id, userId: req.userId })) {
        await Notification.deleteMany({ userId: req.userId, eventId: id });
        return res.status(200).send();
    }
    return res.status(204).send();
}));

router.get("/", asyncHandler(async (req, res) => {
    const eventList = await Event.find({ userId: req.userId });
    return res.status(200).json(eventList);
}));

export default router;