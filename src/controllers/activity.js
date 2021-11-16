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

	// if (req.query.completed)
	// 	match.completed = req.query.completed === 'true'

	if (req.query.category) match.category = req.query.category;

	if (req.query.type) match.type = req.query.type;

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
