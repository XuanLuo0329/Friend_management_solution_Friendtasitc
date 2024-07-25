// scheduler.js
import cron from "node-cron";
import generateNotifications from "./generateNotifications.js";

// Schedule the generateNotifications function to run every minute
cron.schedule("* * * * *", async () => {
    console.log("Running generateNotifications every minute");
    await generateNotifications();
});