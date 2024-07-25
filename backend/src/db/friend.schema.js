import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  birthday: Date,
  gender: { type: String, required: true },
  relationship: { type: String, required: true },
  mbtiType: String,
  hobbies: [String],
  skills: [String],
  preferences: {
    likes: [String],
    dislikes: [String]
  }
});

// create a new friend
async function createFriend(friendData) {
  try {
    const newFriend = new Friend({
      userId: friendData.userId,  
      name: friendData.name,
      gender: friendData.gender,
      birthday: new Date(friendData.birthday), 
      relationship: friendData.relationship, 
      mbtiType: friendData.mbtiType, 
      hobbies: friendData.hobbies,
      skills: friendData.skills,
      preferences: {
        likes: friendData.preferences.likes,
        dislikes: friendData.preferences.dislikes
      }
    });
    const savedFriend = await newFriend.save();
    return savedFriend;
  } catch (error) {
    throw error; 
  }
}

friendSchema.statics.getAllFriendsByUserId = async function (userId) {

  if (!mongoose.isValidObjectId(userId)) {
    throw new Error('Invalid userId');
  }
  const friends = await this.find({ userId: userId }, 'name gender birthday relationship mbtiType hobbies skills preferences');

  console.log(friends);
  const friendsFormatted = friends.map(friend => {
    const date = friend.birthday;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const newDate = new Date(year, month - 1, day);
    const formattedDate = newDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return {
      ...friend.toObject(),
      birthday: formattedDate,
    };
  });

  return friendsFormatted;
};

// a method to delete a friend
friendSchema.methods.deleteFriend = async function() {
  const result = await this.deleteOne(); 
  return result; 
};

// Define the friend model
const Friend = mongoose.model('Friend', friendSchema);

export { Friend, createFriend };