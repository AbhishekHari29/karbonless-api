const cron = require("node-cron");
const Activity = require("./models/activity");
const User = require("./models/user");

const streakTimer_23_59_59 = "59 59 23 * * *";
const streakTimer = "0 0 * * *";

const streakMaintenance = async () => {
	const users = await User.find({});
	users.forEach((user) => {
		user.checkStreak();
	});
};

cron.schedule(streakTimer, streakMaintenance);
