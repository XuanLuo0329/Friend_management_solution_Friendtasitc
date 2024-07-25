import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Friend } from './friend.schema.js'; 
import { User } from './user.schema.js'; 
import { Event } from './event.schema.js';
import { Gift } from './gift.schema.js';  
import fs from "fs";


async function run() {
  // Connect to MongoDB using the connection string from environment variables
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

  // Delete all existing documents in the collections
  await User.deleteMany();
  await Friend.deleteMany();
  await Event.deleteMany();
  await Gift.deleteMany();

  // Load and insert User data
  const usersData = JSON.parse(fs.readFileSync('/app/data/users.json', 'utf8'));
  await User.insertMany(usersData);
  console.log('Users inserted');

  // Load and insert Friend data
  const friendsData = JSON.parse(fs.readFileSync('/app/data/friends.json', 'utf8'));
  await Friend.insertMany(friendsData);
  console.log('Friends inserted');

  await mongoose.disconnect();
  console.log("Data insertion is done!");
}

run().catch(console.error);
