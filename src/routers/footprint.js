const express = require("express");
const auth = require("../middleware/auth");
const {
	addTravelFootprint,
	addFoodFootprint,
	addProductFootprint
} = require("../controllers/footprint");

const router = new express.Router();

//Travel Footprint
router.get("/travel", auth, addTravelFootprint);

//Food Footprint
router.get("/food", auth, addFoodFootprint);

//Product Footprint
router.get("/product", auth, addProductFootprint);

module.exports = router;
