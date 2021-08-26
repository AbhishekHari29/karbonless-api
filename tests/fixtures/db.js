const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");

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

const populateDatabase = async () => {
	await User.deleteMany();

	await new User(userOne).save();
	await new User(userTwo).save();
};

module.exports = {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	populateDatabase
};
