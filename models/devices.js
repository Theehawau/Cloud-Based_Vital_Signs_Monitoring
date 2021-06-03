const mongoose = require("mongoose");
const validator = require('validator')

const devicesSchema = new mongoose.Schema(
	{
		deviceId: {
			type: String,
			unique: true,
		},
        type:{
            type: String,
            validate(value){
                devices = ['wearable', 'ward']
                if(!devices.includes(value.toLowerCase()) ){
                    throw new Error('Device type not Available')
                }
            }
        
        }
	},
	{ timestamps: true }
);
devicesSchema.virtual('wearableData', {
	ref: 'WearableData',
	localField:'_id',
	foreignField: 'device'
})
devicesSchema.virtual('wardData', {
	ref: 'WardData',
	localField:'_id',
	foreignField: 'device'
})

const Devices = mongoose.model("Devices", devicesSchema);
module.exports = Devices;
