const moment = require("moment");
const Activity = require("../models/activity");

//Create Activity
const createActivity = async (req, res) => {
	const activity = new Activity({ ...req.body, owner: req.user._id });
	try {
		const result = await activity.save();
		res.send(result);
	} catch (error) {
		res.status(400).send();
	}
};

//Read All Activities
const readAllActivity = async (req, res) => {
	const limit = parseInt(req.query.limit);
	const skip = parseInt(req.query.skip);
	const match = {};
	const sort = {};

	if (req.query.category) match.category = req.query.category;

	if (req.query.type) match.type = req.query.type;

	if (req.query.duration) {
		const duration = req.query.duration;
		if (/^current(day|week|month)$/i.test(duration)) {
			req.query = { ...req.query, ...getFirstDateOf(duration) };
		} else if (/^\d+:(day|week|month)$/i.test(duration)) {
			const parts = duration.split(":");
			const value = parseInt(parts[0]);
			const type = parts[1].trim();
			req.query.from = moment().subtract(value, type).toDate().getTime();
			req.query.until = new Date().getTime();
		}
	}

	if (req.query.from)
		match.createdAt = {
			...match.createdAt,
			$gte: new Date(Number(req.query.from))
		};

	if (req.query.until)
		match.createdAt = {
			...match.createdAt,
			$lte: new Date(Number(req.query.until))
		};

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(":");
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
	} else {
		sort.createdAt = -1;
	}

	try {
		await req.user
			.populate({
				path: "activities",
				match,
				options: {
					limit,
					skip,
					sort
				}
			})
			.execPopulate();
		res.send(req.user.activities);
	} catch (error) {
		res.status(500).send(error);
	}
};

const getFirstDateOf = (duration) => {
	let from = new Date();
	let until = new Date();
	switch (duration.toLowerCase()) {
		case "currentday":
			break;
		case "currentweek":
			from.setDate(until.getDate() - until.getDay());
			break;
		case "currentmonth":
			from.setDate(1);
			break;
		default:
			break;
	}
	from.setHours(0);
	from.setMinutes(0);
	from.setSeconds(0);
	from.setMilliseconds(0);
	from = from.getTime();
	until = until.getTime();
	return { from, until };
};

//Read Activity by Id
const readActivity = async (req, res) => {
	const _id = req.params.id;
	try {
		const activity = await Activity.findOne({ _id, owner: req.user._id });
		if (!activity) return res.status(404).send();
		res.send(activity);
	} catch (error) {
		res.status(500).send();
	}
};

//Update Activity By Id
const updateActivity = async (req, res) => {
	const _id = req.params.id;

	const updates = Object.keys(req.body);
	// const allowedUpdates = ["name", "description", "type", "cfg"];
	const allowedUpdates = [
		"category",
		"type",
		"total_emission",
		"mode",
		"quantity",
		"co2_emission"
	];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation)
		return res.status(400).send({ error: "Invalid Update Operation" });

	try {
		const activity = await Activity.findOne({ _id, owner: req.user._id });
		if (!activity) return res.status(404).send();
		updates.forEach((update) => (activity[update] = req.body[update]));
		await activity.save();
		res.send(activity);
	} catch (error) {
		res.status(400).send(error);
	}
};

//Delete Activity By Id
const deleteActivity = async (req, res) => {
	const _id = req.params.id;
	try {
		const activity = await Activity.findOneAndDelete({
			_id,
			owner: req.user._id
		});
		if (!activity) return res.status(404).send();
		res.send(activity);
	} catch (error) {
		res.status(500).send(error);
	}
};

module.exports = {
	createActivity,
	readAllActivity,
	readActivity,
	updateActivity,
	deleteActivity
};
