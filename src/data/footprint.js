const path = require("path");
const xlsx = require("xlsx");

const dataPath = path.join(__dirname, "./");
const fileName = "Footprint.xlsx";

// Read File
const footprintWorkbook = xlsx.readFile(dataPath + "/" + fileName);

// Import Data
const travelData = xlsx.utils.sheet_to_json(
	footprintWorkbook.Sheets[footprintWorkbook.SheetNames[0]]
);
const foodData = xlsx.utils.sheet_to_json(
	footprintWorkbook.Sheets[footprintWorkbook.SheetNames[1]]
);
const productData = undefined;

// MinMax Footprint
const minTravel = travelData.reduce(minEmission, travelData[0]).co2_emission;
const maxTravel = travelData.reduce(maxEmission, travelData[0]).co2_emission;
const minFood = foodData.reduce(minEmission, foodData[0]).co2_emission;
const maxFood = foodData.reduce(maxEmission, foodData[0]).co2_emission;

const minEmission = (min, value) =>
	min.co2_emission < value.co2_emission ? min : value;

const maxEmission = (min, value) =>
	min.co2_emission > value.co2_emission ? min : value;

const computeKredits = (value, max, min) =>
	Math.floor(((max - value) / (max - min)) * 10);

// Travel
const computeTravelFootprint = (type, mode, distance = 1) => {
	var result = travelData.find(
		(data) => type === data.type && mode === data.mode
	);
	if (!result) return;
	result.total_emission = result.co2_emission * distance;
	result.distance = distance;
	result.kredit = computeKredits(result.co2_emission, maxTravel, minTravel);
	return result;
};

// Food
const computeFoodFootprint = (type, quantity = 1) => {
	var result = foodData.find((data) => type === data.type);
	if (!result) return;
	result.total_emission = result.co2_emission * quantity;
	result.quantity = quantity;
	result.kredit = computeKredits(result.co2_emission, maxFood, minFood);
	return result;
};

// Product
const computeProductFootprint = (productName) => {};

module.exports = {
	computeFoodFootprint,
	travelData,
	computeTravelFootprint,
	foodData,
	computeProductFootprint,
	productData
};
