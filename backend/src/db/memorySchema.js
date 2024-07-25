import mongoose from 'mongoose';

// Define the memory schema
const memoriesSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title:{ type: String , required: true},
    tag: String,
    date: {type : Date, required: true},
    description: {type: String, required: true},
    image: String
}); 

// Define the memory model
const Memory = mongoose.model('Memory', memoriesSchema);

// a method to update a memory
memoriesSchema.methods.updateMemory = async function(updates) {
  Object.assign(this, updates);
  return this.save();
};

// a method to delete a memory
memoriesSchema.methods.deleteMemory = async function() {
  return this.remove();
};

export { Memory};