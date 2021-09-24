const express = require("express");
const auth = require("../middleware/auth");
const {
	createActivity,
	readAllActivity,
	readActivity,
	updateActivity,
	deleteActivity
} = require("../controllers/activity");

const router = new express.Router();

//Create Activity
router.post("/activity", auth, createActivity);

//Read All Activity
router.get("/activity", auth, readAllActivity);

//Read Activity by Id
router.get("/activity/:id", auth, readActivity);

//Update Activity by Id
router.patch("/activity/:id", auth, updateActivity);

//Delete Activity by Id
router.delete("/activity/:id", auth, deleteActivity);

module.exports = router;
