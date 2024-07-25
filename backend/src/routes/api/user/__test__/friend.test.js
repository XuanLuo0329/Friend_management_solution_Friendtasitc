import request from 'supertest';
import bodyParser from 'body-parser';
import friendRouter from '#routes/api/user/friend';
import authRouter from '#routes/api/auth'; 
import { Friend } from "#db/friend.schema";
import express from 'express';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let app, mongod, token;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    app = express();
    app.use(bodyParser.json());
    app.use('/api/auth', authRouter);
    app.use('/api/user/friend', friendRouter);

    await request(app)
        .post('/api/register')
        .send({
            firstName: "Test User",
            lastName: "Test User",
            email: "test@example.com",
            password: "Password123!",
            
        });

    const res = await request(app)
        .post('/api/login')
        .send({
            email: "test@example.com",
            password: "Password123!"
        });

    token = res.body.token; 
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await Friend.deleteMany({});
});

it('should create a friend', async () => {
    const friendData = {
        name: "John Doe",
        gender: "Male",
        birthday: "1990-01-01",
        relationship: "Colleague",
        preferences: { 
          likes: ["Coding", "Coffee"],
          dislikes: ["Slow Internet"]
        }
      };
    const response = await request(app)
        .post('/api/user/friend')
        .set('Authorization', `Bearer ${token}`)
        .send(friendData)
        .expect(201);

    expect(response.body.name).toBe(friendData.name);
    expect(response.body.gender).toBe(friendData.gender);
});

it('should delete a friend', async () => {
    const friendData = {
        name: "John Doe",
        gender: "Male",
        birthday: "1990-01-01",
        relationship: "Colleague",
        preferences: { 
          likes: ["Coding", "Coffee"],
          dislikes: ["Slow Internet"]
        }
      };
    const res = await request(app)
        .post('/api/user/friend')
        .set('Authorization', `Bearer ${token}`)
        .send(friendData)
        .expect(201);

    await request(app)
        .delete(`/api/user/friend/${res.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    const friendCheck = await Friend.findById(res.body._id);
    expect(friendCheck).toBeNull();
});