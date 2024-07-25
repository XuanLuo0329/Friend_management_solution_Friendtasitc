// tests/generateNotifications.test.js
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Notification } from "#db/notification.schema";
import { Event } from "#db/event.schema";
import generateNotifications from "../generateNotifications";

let mongoServer;

const mockUserId = new mongoose.Types.ObjectId();

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Notification.deleteMany({});
    await Event.deleteMany({});
});

describe("generateNotifications Function", () => {
    test("should create a notification for an event with a reminder", async () => {
        const event = new Event({
            userId: mockUserId,
            title: "Birthday Party",
            content: "Don't forget to bring a gift!",
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 - 10000), // 2 days from now
            reminder: { daysBefore: 2, method: "email" },
        });
        await event.save();

        await generateNotifications();
        await new Promise((resolve) => {setTimeout(resolve, 100);});
        
        const notifications = await Notification.find({});
        expect(notifications).toHaveLength(1);
        expect(notifications[0].title).toBe("Birthday Party");
        expect(notifications[0].reminderTime).toBeInstanceOf(Date);
    });

    test("should not duplicate notifications if one already exists", async () => {
        const event = new Event({
            userId: mockUserId,
            title: "Conference",
            content: "Bring your presentation slides.",
            startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            reminder: { daysBefore: 1, method: "email" },
        });
        await event.save();

        const reminderTime = new Date(event.startTime);
        reminderTime.setDate(reminderTime.getDate() - 1); // 1 day before

        await Notification.create({
            userId: mockUserId,
            eventId: event._id,
            title: event.title,
            content: event.content,
            startTime: event.startTime,
            reminderTime,
            method: event.reminder.method,
        });

        await generateNotifications();

        const notifications = await Notification.find({});
        expect(notifications).toHaveLength(1);
    });

    test("should not create notifications for events starting in the past", async () => {
        const event = new Event({
            userId: mockUserId,
            title: "Past Event",
            content: "This event has already passed.",
            startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            reminder: { daysBefore: 1, method: "email" },
        });
        await event.save();

        await generateNotifications();

        const notifications = await Notification.find({});
        expect(notifications).toHaveLength(0);
    });
    
});
