const mongoose = require("mongoose");

const wardDataSchema= new mongoose.Schema(
	{
		Temperature: {
			type: Number
		},
		wardDevice: {
			type: String		
		},
		Humidity:{
			type: Number
		},
		Fire:{
			type:String,
			default: 'No'
		},
		Noise:{
			type:String,
			default: 'Low'
		},
		device:{
			type:String
		}
	},
	{
		timestamps: true,
	}
);

const WardData = mongoose.model("WardData", wardDataSchema);
module.exports = WardData;
