import request from 'supertest';
import bodyParser from 'body-parser';
import giftRouter from '#routes/api/user/gift'; // Adjust the import path as needed
import { Gift } from "#db/gift.schema";
import express from 'express';
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let app, mongod, token;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());

    app = express();
    app.use(bodyParser.json());
    app.use('/api/user/gift', giftRouter); // Adjust the route path as needed

    // Assuming you have a similar setup for login to get the token
    const res = await request(app)
        .post('/api/login') // Adjust the path as needed
        .send({
            email: "user@example.com",
            password: "password"
        });
    token = res.body.token; 
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

beforeEach(async () => {
    await Gift.deleteMany({});
});

it('should retrieve gifts for a user', async () => {
    const res = await request(app)
        .get('/api/user/gift')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(res.body).toBeInstanceOf(Array);
});

it('should delete a gift', async () => {
    const giftData = {
        friendId: new mongoose.Types.ObjectId(),
        friendName: "John Doe",
        giftName: "Coffee Mug",
        reasons: "Birthday gift",
        purchasePlace: "Amazon",
        imageUrl: "http://example.com/image.jpg"
    };
    const gift = await new Gift(giftData).save();

    await request(app)
        .delete(`/api/user/gift/${gift._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
});
