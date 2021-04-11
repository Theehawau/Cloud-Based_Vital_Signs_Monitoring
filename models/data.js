const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
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
		gender:{
			type: String
		},
		age:{
			type:String
		}
	},
	{
		timestamps: true,
	}
);

const Data = mongoose.model("Data", dataSchema);
module.exports = Data;
