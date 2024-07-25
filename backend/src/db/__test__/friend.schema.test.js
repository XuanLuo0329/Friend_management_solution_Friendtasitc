import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Friend} from '../friend.schema';

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri(), { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
    await Friend.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

const friendTemplate = {
    userId: new mongoose.Types.ObjectId(),
    name: "John Doe",
    birthday: new Date('1990-01-01'),
    gender: "Male",
    relationship: "Colleague",
    mbtiType: "INTJ",
    hobbies: ["Reading", "Coding"],
    skills: ["JavaScript"],
    preferences: {
        likes: ["Coffee"],
        dislikes: ["Slow Internet"]
    }
};

it("can create a new friend", async () => {
    const newFriend = await Friend.create(friendTemplate);
    expect(newFriend).toMatchObject({
        name: "John Doe", 
        gender: "Male"
    });
});

it("can find friends by userId", async () => {
    await Friend.create(friendTemplate);
    const foundFriends = await Friend.getAllFriendsByUserId(friendTemplate.userId);
    expect(foundFriends.length).toBe(1);
    expect(foundFriends[0].name).toEqual("John Doe");
});

it("can delete a friend", async () => {
    let newFriend = await Friend.create(friendTemplate);
    await newFriend.deleteFriend();
    const foundFriends = await Friend.find({});
    expect(foundFriends.length).toBe(0);
});