const mongoose = require("mongoose");
const validator = require("validator");

const activitySchema = new mongoose.Schema(
	{
		// Fixed Fields
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User"
		},
		category: {
			type: String,
			required: true,
			trim: true
		},
		type: {
			type: String,
			required: true,
			trim: true
		},
		total_emission: {
			type: Number,
			required: true
		},
		kredit: {
			type: Number,
			default: 0
		},
		// Optional Fields
		mode: {
			type: String,
			trim: true
		},
		distance: {
			type: Number
		},
		quantity: {
			type: Number
		},
		co2_emission: {
			type: Number
		}
	},
	{
		timestamps: true
	}
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
