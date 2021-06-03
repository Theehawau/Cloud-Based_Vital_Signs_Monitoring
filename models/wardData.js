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
		Lux:{
			type: Number
		},
		AirQuality:{
			type:String,
			default: 'Ok'
		},
		Flame:{
			type:String,
			default: 'Ok'
		},
		Noise:{
			type:String,
			default: 'Ok'
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
