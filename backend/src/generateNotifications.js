import { Event } from "#db/event.schema";
import { Notification } from "#db/notification.schema";

// Function to create a notification document
const createNotification = async (user, event, reminderTime) => {
    const existingNotification = await Notification.findOne({
        userId: user._id,
        eventId: event._id,
        reminderTime,
    });

    if (!existingNotification) {
        await Notification.create({
            userId: user._id,
            eventId: event._id,
            title: event.title,
            content: event.content,
            startTime: event.startTime,
            reminderTime,
            method: event.reminder.method,
        });
    }
};

// Function to generate notifications
const generateNotifications = async () => {
    const now = new Date();
    const events = await Event.find({
        'reminder.daysBefore': { $exists: true },
        startTime: { $gte: now },
    });

    events.forEach(event => {
        const reminderTime = new Date(event.startTime);
        reminderTime.setDate(reminderTime.getDate() - event.reminder.daysBefore);

        // Check if it's time to send a reminder
        if (now >= reminderTime && now < event.startTime) {
            createNotification(event.userId, event, reminderTime);
        }
    });
};

export default generateNotifications;