const path = require("path");
const xlsx = require("xlsx");

const dataPath = path.join(__dirname, "./");
const fileName = "Footprint.xlsx";

const footprintWorkbook = xlsx.readFile(dataPath + "/" + fileName);
const travelData = xlsx.utils.sheet_to_json(
	footprintWorkbook.Sheets[footprintWorkbook.SheetNames[0]]
);
const foodData = xlsx.utils.sheet_to_json(
	footprintWorkbook.Sheets[footprintWorkbook.SheetNames[1]]
);
const productData = undefined;

const computeTravelFootprint = (type, mode, distance = 1) => {
	var result = travelData.find(
		(data) => type === data.type && mode === data.mode
	);
	if (!result) return;
	result.total_emission = result.co2_emission * distance;
	result.distance = distance;
	return result;
};

const computeFoodFootprint = (type, quantity = 1) => {
	var result = foodData.find((data) => type === data.type);
	if (!result) return;
	result.total_emission = result.co2_emission * quantity;
	result.quantity = quantity;
	return result;
};

const computeProductFootprint = (productName) => {};

module.exports = {
	computeFoodFootprint,
	travelData,
	computeTravelFootprint,
	foodData,
	computeProductFootprint,
	productData
};
