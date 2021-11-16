const sharp = require("sharp");
const User = require("../models/user");

//Login User
const loginUser = async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error.message);
	}
};

//Logout User
const logoutUser = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();
		res.send();
	} catch (error) {
		res.send(500).send(error);
	}
};

//Logout All
const logoutAll = async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.send(500).send(error);
	}
};

//Create User
const createUser = async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error.message);
	}
};

//Read User Profile
const fetchUser = async (req, res) => {
	res.send(req.user);
};

// Read User By Id
const fetchUserById = async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) return res.status(404).send();
		res.send(user);
	} catch (error) {
		res.status(500).send(error);
	}
};

//Update User
const updateUser = async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "email", "password", "age"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation)
		return res.status(400).send({ error: "Invalid Update Operation" });

	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error.message);
	}
};

//Delete User
const deleteUser = async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (error) {
		res.status(500).send(error);
	}
};

//Upload Profile avatar
const uploadAvatar = async (req, res) => {
	const buffer = await sharp(req.file.buffer)
		.resize({ width: 250, height: 250 })
		.png()
		.toBuffer();
	req.user.avatar = buffer;
	await req.user.save();
	res.send("Profile avatar uploaded successfully");
};

//Get Profile avatar
const fetchAvatarById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) throw new Error();
		res.set("Content-Type", "image/jpg");
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send();
	}
};

//Delete Profile avatar
const deleteAvatar = async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send("Profile avatar deleted successfully");
};

module.exports = {
	loginUser,
	logoutUser,
	logoutAll,
	createUser,
	updateUser,
	fetchUser,
	fetchUserById,
	deleteUser,
	uploadAvatar,
	fetchAvatarById,
	deleteAvatar
};
