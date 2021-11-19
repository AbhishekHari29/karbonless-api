const { createActivity } = require("./activity");
const {
	computeTravelFootprint,
	travelData,
	computeFoodFootprint,
	foodData,
	computeProductFootprint,
	productData
} = require("../data/footprint");

const addTravelFootprint = (req, res) => {
	try {
		const type = req.query.type;
		const mode = req.query.mode;
		let distance = parseInt(req.query.distance);
		distance = isNaN(distance) ? 1 : distance;
		const result = computeTravelFootprint(type, mode, distance);
		if (!result) return res.status(404).send();
		req.body = { ...result, category: "Travel" };
		createActivity(req, res);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getAllTravelFootprint = (req, res) => {
	try {
		res.send(travelData);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const addFoodFootprint = (req, res) => {
	try {
		const type = req.query.type;
		let quantity = parseFloat(req.query.quantity);
		quantity = isNaN(quantity) ? 1 : quantity;
		const result = computeFoodFootprint(type, quantity);
		if (!result) return res.status(404).send();
		req.body = { ...result, category: "Food" };
		createActivity(req, res);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const getAllFoodFootprint = (req, res) => {
	try {
		res.send(foodData);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

const addProductFootprint = (req, res) => {};

const getAllProductFootprint = (req, res) => {
	try {
		res.send(productData);
	} catch (error) {
		res.status(500).send(error.message);
	}
};

module.exports = {
	addTravelFootprint,
	getAllTravelFootprint,
	addFoodFootprint,
	getAllFoodFootprint,
	addProductFootprint,
	getAllProductFootprint
};
