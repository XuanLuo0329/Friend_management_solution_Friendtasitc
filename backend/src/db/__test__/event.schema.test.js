import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Event } from '../event.schema';

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
}, 60 * 1000);

beforeEach(async () => {
    await Event.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

const eventTemplate = {
    userId: "6636d0e78261a3fa81bb31b3",
    title: 'birth day',
    content: 'friend 1 birthday',
    startTime: new Date(2024, 4, 30, 17, 30),
    endTime: new Date(2024, 4, 30, 18, 0),
    repeat: false,
    tags: ['birthday'],
}

it("can save one time event", async () => {
    const newEvent = await Event.create(eventTemplate);
    expect(newEvent.toJSON({flattenObjectIds: true})).toMatchObject(eventTemplate);
});

it("failed to create repeated event if repeatRule is not defined", async () => {
    expect(async () => await Event.create({
        ...eventTemplate,
        repeat: true,
    })).rejects.toThrow(mongoose.Error.ValidationError);
});

it("can save a daily repeated event", async () => {
    const newEvent = await Event.create({
        ...eventTemplate,
        repeat: true,
        repeatRule: {
            startDate: new Date(2024, 4, 30),
            repeat: "daily",
            interval: 1,
        },
    });
});

it("can save a weekly repeated event with reminder", async () => {
    const newEvent = await Event.create({
        ...eventTemplate,
        reminder: {
            daysBefore: 4,
            method: "email",    
        },
        repeat: true,
        repeatRule: {
            startDate: new Date(2024, 4, 30),
            repeat: "weekly",
            interval: 1,
        },
    });
});