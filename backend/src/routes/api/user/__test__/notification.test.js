// tests/notification.test.js
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import notification from "#routes/api/user/notification";
import { Notification } from "#db/notification.schema";

let app;
let mongoServer;

const mockUserId = new mongoose.Types.ObjectId();
const mockEventId = new mongoose.Types.ObjectId();

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    app = express();
    app.use(express.json());

    // Mock middleware to set `req.userId`
    app.use((req, res, next) => {
        req.userId = mockUserId;
        next();
    });

    app.use("/api/notifications", notification);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Notification.deleteMany({});
});

describe("Notification API", () => {
    test("should get an empty list when no notifications exist", async () => {
        const response = await request(app).get("/api/notifications");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test("should return all notifications for the user", async () => {
        const notification = new Notification({
            userId: mockUserId,
            eventId: mockEventId,
            title: "Event Reminder",
            content: "This is a test notification",
            startTime: new Date(),
            reminderTime: new Date(),
            method: "email",
            sent: false,
        });
        await notification.save();

        const response = await request(app).get("/api/notifications");
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe("Event Reminder");
    });

    test("should delete a notification by id", async () => {
        const notification = new Notification({
            userId: mockUserId,
            eventId: mockEventId,
            title: "Delete Test",
            content: "This is a test notification",
            startTime: new Date(),
            reminderTime: new Date(),
            method: "email",
            sent: false,
        });
        await notification.save();

        const response = await request(app).delete(`/api/notifications/${notification._id}`);
        expect(response.status).toBe(200);

        const deletedNotifications = await Notification.find({ userId: mockUserId, deleted: true});
        expect(deletedNotifications).toHaveLength(1);
    });

    test("should return 204 if notification is not found for deletion", async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).delete(`/api/notifications/${nonExistentId}`);
        expect(response.status).toBe(204);
    });
});
