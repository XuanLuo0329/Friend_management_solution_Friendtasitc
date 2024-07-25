import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, validate } from '../user.schema';

let mongod;

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
}, 60 * 1000);

beforeEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

const userTemplate = {
    firstName: "First",
    lastName: "Last",
    email: "test@test.com",
    password: "qW34567*",
}

it("can create new user", async () => {
    const newUser = await User.create(userTemplate);
    expect(newUser).toMatchObject(userTemplate);
});

it("can detect invalid email and password", async () => {
   const { error: emailError } = validate({...userTemplate, email: "test"});
   expect(emailError.details[0].message).toContain('Email');

   const { error: passwordError } = validate({...userTemplate, password: "123"});
   expect(passwordError.details[0].message).toContain('Password');
});