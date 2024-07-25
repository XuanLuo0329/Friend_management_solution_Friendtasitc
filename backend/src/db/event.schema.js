import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  startTime: Date,
  endTime: Date,
  reminder: {
    daysBefore: Number,
    method: { type: String, enum: ['email'], default: 'email' },
  },
  repeat: { type: Boolean, required: true, default: false },
  repeatRule: { _id: false, required: function () { return this.repeat },
    type: {
      startDate: { type: Date, required: true },
      repeat: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] },
      interval: { type: Number, default: 1 },
      endDate: Date,
    }
  },
  tags: [String],
});

const Event = mongoose.model("Event", EventSchema);

export { Event };