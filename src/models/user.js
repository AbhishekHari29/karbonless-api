const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const moment = require("moment");
const Activity = require("../models/activity");

const dailyLimit = 10000;

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value))
					throw new Error("Email is invalid");
			}
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minLength: [6, "Password length atleast 6"],
			validate(value) {
				if (value.toLowerCase().includes("password"))
					throw new Error("Password can't include 'password'");
			}
		},
		age: {
			type: Number,
			default: 0,
			validate(value) {
				if (value < 0) throw new Error("Age should be positive number");
			}
		},
		kredit: {
			type: Number,
			default: 0
		},
		rank: {
			type: Number,
			default: 0
		},
		streak: {
			type: Number,
			default: 0
		},
		tokens: [
			{
				token: {
					type: String,
					required: true
				}
			}
		],
		avatar: {
			type: Buffer
		}
	},
	{
		timestamps: true
	}
);

userSchema.virtual("activities", {
	ref: "Activity",
	localField: "_id",
	foreignField: "owner"
});

//Display Public Information
userSchema.methods.toJSON = function () {
	const user = this;
	const userObj = user.toObject();

	delete userObj.password;
	delete userObj.tokens;
	delete userObj.avatar;

	return userObj;
};

//Generate JWT
userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign(
		{ _id: user._id.toString() },
		process.env.JWT_SECRET
	);
	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

// Check Streak
userSchema.methods.checkStreak = async function (date = new Date()) {
	const user = this;
	const result = await Activity.aggregate([
		{
			$match: {
				owner: user._id,
				createdAt: {
					$gte: moment(date).subtract(1, "day").toDate(),
					$lte: date
				}
			}
		},
		{
			$group: {
				_id: null,
				totalEmission: { $sum: "$total_emission" }
			}
		}
	]);

	if (result.length > 0 && result[0].totalEmission <= dailyLimit) {
		user.streak++;
		user.kredit += 100;
		if (user.streak !== 0 && user.streak % 7 === 0) user.kredit += 300;
		if (user.streak !== 0 && user.streak % 30 === 0) user.kredit += 1000;
	} else {
		user.streak = 0;
	}
	user.rank = Math.floor(user.kredit / 1000);
	await user.save();
};

// Add Kredits
userSchema.methods.addKredits = async function (kredit = 0) {
	const user = this;
	user.kredit += kredit;
	user.rank = Math.floor(user.kredit / 1000);
	await user.save();
};

//Find User by Credentials
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });
	if (!user) throw new Error("Unable to Login");
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error("Unable to Login");
	return user;
};

//Hash password
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password"))
		user.password = await bcrypt.hash(user.password, 8);
	next();
});

//Delete Activities when user is Deleted
userSchema.pre("remove", async function (next) {
	const user = this;
	await Activity.deleteMany({ owner: user._id });
	next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
