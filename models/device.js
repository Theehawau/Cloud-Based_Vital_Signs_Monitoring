const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
	{
		deviceId: {
			type: String,
			unique: true,
		},
		patientGender:{
			type: String,
			default: null,
			lowercase:true
		},
		patientAge:{
			type: String,
			default: null
		}
	},
	{ timestamps: true }
);
deviceSchema.virtual('data', {
	ref: 'Data',
	localField:'_id',
	foreignField: 'device'
})

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
