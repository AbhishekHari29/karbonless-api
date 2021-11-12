const path = require("path");
const xlsx = require("xlsx");

const dataPath = path.join(__dirname, "./");

var travelWorkbook = xlsx.readFile(dataPath + "/Travel.csv");
var travelSheet = travelWorkbook.SheetNames[0];
var travelRows = xlsx.utils.sheet_to_json(travelWorkbook.Sheets[travelSheet]);

const computeFoodFootprint = (food, quantity) => {};

const computeTravelFootprint = (type, mode, distance) => {
	var result = travelRows.find((row) => {
		return type === row.type && mode === row.mode;
	});
	if(!result) return;
	result.total_emission = result.co2_emission * distance;
    result.distance = distance
	return result;
};

const computeProductFootprint = (productName) => {};

module.exports = {
	computeFoodFootprint,
	computeTravelFootprint,
	computeProductFootprint
};
