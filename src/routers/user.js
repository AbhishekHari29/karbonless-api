const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth");
const {
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
} = require("../controllers/user");

const router = new express.Router();
const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
			return cb(new Error("Please upload a Image File"));
		cb(undefined, true);
	}
});

//Login User
router.post("/users/login", loginUser);

//Logout User
router.post("/users/logout", auth, logoutUser);

//Logout All
router.post("/users/logoutAll", auth, logoutAll);

//Create User
router.post("/users", createUser);

//Read User Profile
router.get("/users/me", auth, fetchUser);

//Read User By Id
// router.get("/users/:id", fetchUserById);

//Update User
router.patch("/users/me", auth, updateUser);

//Delete User
router.delete("/users/me", auth, deleteUser);

//Upload Profile avatar
router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
	uploadAvatar,
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

//Get Profile avatar
router.get("/users/:id/avatar", fetchAvatarById);

//Delete Profile avatar
router.delete("/users/me/avatar", auth, deleteAvatar);

module.exports = router;
