const mongoose = require("mongoose");

const wearableDataSchema = new mongoose.Schema(
	{
		temperature: {
			type: Number
		},
		pulse: {
			type: Number
		},
		fatal:{
			type:Boolean
		},
		device: {
			type: String		
		},
		pulseHighLimit:{
			type: Number
		},
		pulseLowLimit:{
			type: Number
		}
	},
	{
		timestamps: true,
	}
);

const WearableData = mongoose.model("WearableData", wearableDataSchema);
module.exports = WearableData;
