const { createActivity } = require("./activity");
const {
	computeTravelFootprint,
	computeFoodFootprint,
	computeProductFootprint
} = require("../data/footprint");

const addTravelFootprint = (req, res) => {
	try {
		const type = req.query.type;
		const mode = req.query.mode;
		const distance = parseInt(req.query.distance ?? 1);
		const result = computeTravelFootprint(type, mode, distance);
		if (!result) return res.status(404).send();
		req.body = { ...result, category: "Travel" };
		createActivity(req, res);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const addFoodFootprint = (req, res) => {};

const addProductFootprint = (req, res) => {};

module.exports = {
	addTravelFootprint,
	addFoodFootprint,
	addProductFootprint
};
