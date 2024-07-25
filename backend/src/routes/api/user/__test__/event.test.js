import request from 'supertest';
import router from '#routes/api/user/index';
import { Event } from "#db/event.schema";
import express from 'express';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
}, 60 * 1000);

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await Event.deleteMany({});
});

const app = express();
app.use(express.json());
app.use('/api/user', router);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjM2ZGIwZWI4MDQzOWMwNjI0ZjE2OGYiLCJpYXQiOjE3MTQ4NzEwNTQsImV4cCI6MTc0NjQwNzA1NH0.Js7n8N6uBeoWBoIPw6XEif6XATWQux7crUMX1ttoXkc';

it('can create, update and delete event', async () => {
    const eventTemplate = {
        title: 'birth day',
        content: 'friend 1 birthday',
        startTime: '2024-05-30T17:30:00.000Z',
        endTime: '2024-05-30T18:00:00.000Z',
        repeat: false,
        tags: ['birthday'],
    }
    const postRes = await request(app)
        .post('/api/user/event')
        .set('Authorization', `Bearer ${token}`)
        .send(eventTemplate)
        .expect(201);
    expect(postRes._body).toMatchObject(eventTemplate);
    const createdEvent = await Event.findById(postRes._body._id);
    expect(JSON.parse(JSON.stringify(createdEvent))).toMatchObject(eventTemplate);

    const updateEventBody = {
        ...eventTemplate,
        reminder: {
            daysBefore: 4,
            method: "email",
        }
    };
    const putRes = await request(app)
        .put('/api/user/event/' + postRes._body._id)
        .set('Authorization', `Bearer ${token}`)
        .send(updateEventBody)
        .expect(200);
    const updatedEvent = await Event.findById(putRes._body._id);
    expect(putRes._body._id).toBe(postRes._body._id);
    expect(JSON.parse(JSON.stringify(updatedEvent))).toMatchObject(updateEventBody);

    await request(app)
        .delete('/api/user/event/' + postRes._body._id)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .expect(200);
    expect(await Event.findById(putRes._body._id)).toBeNull();
});

it('should return all event under a user', async () => {
    const eventTemplate = {
        title: 'birth day',
        content: 'friend 1 birthday',
        startTime: '2024-05-30T17:30:00.000Z',
        endTime: '2024-05-30T18:00:00.000Z',
        repeat: false,
        tags: ['birthday'],
    }
    let expectedEventList = [];
    for (let i = 0; i < 4; i++) {
        const res = await request(app)
        .post('/api/user/event')
        .set('Authorization', `Bearer ${token}`)
        .send(eventTemplate)
        .expect(201);
        expectedEventList.push(res._body);
    }
    
    const eventList = await request(app)
        .get('/api/user/event')
        .set('Authorization', `Bearer ${token}`)
        .send(eventTemplate).expect(200);
    expect(eventList._body).toMatchObject(expectedEventList);
});
