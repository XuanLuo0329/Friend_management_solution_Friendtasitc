
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    title: String,
    content: String,
    startTime: Date,
    reminderTime: Date,
    method: { type: String, enum: ['email'], default: 'email' },
    sent: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  });
  
  const Notification = mongoose.model('Notification', NotificationSchema);

export { Notification }