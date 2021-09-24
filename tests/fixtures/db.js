const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Activity = require("../../src/models/activity");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: "User One",
	email: "userone@example.com",
	password: "UserOne@123",
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
		}
	]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	name: "User Two",
	email: "usertwo@example.com",
	password: "UserTwo@987",
	tokens: [
		{
			token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
		}
	]
};

const activityOneId = new mongoose.Types.ObjectId();
const activityOne = {
	_id: activityOneId,
	name: "activity One",
	type:"CFG",
	cfg: 1.2,
	owner: userOneId
};

const activityTwoId = new mongoose.Types.ObjectId();
const activityTwo = {
	_id: activityTwoId,
	name: "activity Two",
	type:"CFG",
	cfg: 2.3,
	owner: userOneId
};

const activityThreeId = new mongoose.Types.ObjectId();
const activityThree = {
	_id: activityThreeId,
	name: "activity Three",
	cfg: 3.4,
	type:"CFG",
	description:"Activity 3 Description",
	owner: userTwoId
};

const populateDatabase = async () => {
	await User.deleteMany();
	await Activity.deleteMany();

	await new User(userOne).save();
	await new User(userTwo).save();

	await new Activity(activityOne).save();
	await new Activity(activityTwo).save();
	await new Activity(activityThree).save();
};

module.exports = {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	activityOneId,
	activityOne,
	activityTwo,
	activityTwoId,
	activityThree,
	activityThreeId,
	populateDatabase
};
