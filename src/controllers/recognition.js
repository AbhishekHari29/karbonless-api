const _ = require("lodash");
const vision = require("@google-cloud/vision");
const fs = require("fs");
const path = require("path");

const requiredFields = ["name", "score"];

// Creates a client
const client = new vision.ImageAnnotatorClient({
	credentials: {
		private_key: _.replace(
			process.env.GCS_PRIVATE_KEY,
			new RegExp("\\\\n", "g"),
			"\n"
		),
		client_email: process.env.GCS_CLIENT_EMAIL
	}
});

const recognizeImage = async (req, res) => {
	try {
		const request = {
			image: { content: req.file.buffer }
		};
		const [result] = await client.objectLocalization(request);
		const objects = result.localizedObjectAnnotations;
		objects.forEach((object) => {
			Object.keys(object).forEach((key) => {
				if (!requiredFields.includes(key)) delete object[key];
			});
		});
		res.send(objects);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = {
	recognizeImage
};
