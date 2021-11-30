const express = require("express");
const multer = require("multer");
const { recognizeImage } = require("../controllers/recognition");

const router = new express.Router();

const upload = multer({
	limits: {
		fileSize: 5000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
			return cb(new Error("Please upload a Image File"));
		cb(undefined, true);
	}
});

// Recognize Image
router.post(
	"/image",
	upload.single("input"),
	recognizeImage,
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

module.exports = router;
