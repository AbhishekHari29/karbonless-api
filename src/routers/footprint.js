const express = require("express");
const auth = require("../middleware/auth");
const {
	addTravelFootprint,
	getAllTravelFootprint,
	addFoodFootprint,
	getAllFoodFootprint,
	addProductFootprint,
	getAllProductFootprint
} = require("../controllers/footprint");

const router = new express.Router();

//Travel Footprint
router.get("/travel", auth, addTravelFootprint);

router.get("/travel/all", getAllTravelFootprint);

//Food Footprint
router.get("/food", auth, addFoodFootprint);

router.get("/food/all", getAllFoodFootprint);

//Product Footprint
router.get("/product", auth, addProductFootprint);

router.get("/product/all", getAllProductFootprint);

module.exports = router;
