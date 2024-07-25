import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Gift } from '../gift.schema';

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

beforeEach(async () => {
    await Gift.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
});

const giftTemplate = {
    userId: new mongoose.Types.ObjectId(),
    friendId: new mongoose.Types.ObjectId(),
    friendName: "Alice",
    giftName: "Book",
    reasons: "Congrats on the new job",
    purchasePlace: "Bookstore",
    imageUrl: "http://example.com/book.jpg"
}

it("can save a gift with all required fields", async () => {
    const newGift = await Gift.create(giftTemplate);
    expect(newGift.toJSON()).toMatchObject({
        userId: expect.any(mongoose.Types.ObjectId),
        friendId: expect.any(mongoose.Types.ObjectId),
        friendName: giftTemplate.friendName,
        giftName: giftTemplate.giftName,
        reasons: giftTemplate.reasons,
        purchasePlace: giftTemplate.purchasePlace,
        imageUrl: giftTemplate.imageUrl
    });
});

it("fails to create a gift if a required field is missing", async () => {
    const incompleteGift = {...giftTemplate};
    delete incompleteGift.giftName; // Remove a required field

    await expect(Gift.create(incompleteGift)).rejects.toThrow(mongoose.Error.ValidationError);
});

it("can save a gift without optional fields", async () => {
    const minimalGift = {
        ...giftTemplate,
        imageUrl: undefined  // Omit the optional imageUrl
    };
    const newGift = await Gift.create(minimalGift);
    expect(newGift.toJSON()).toMatchObject({
        userId: expect.any(mongoose.Types.ObjectId),
        friendId: expect.any(mongoose.Types.ObjectId),
        friendName: minimalGift.friendName,
        giftName: minimalGift.giftName,
        reasons: minimalGift.reasons,
        purchasePlace: minimalGift.purchasePlace
    });
    expect(newGift.imageUrl).toBeUndefined();
});