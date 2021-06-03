const express = require("express");
const router = new express.Router();
const Devices = require("../../models/devices");
const WardData = require('../../models/wardData');
// const WearableData = require('../../models/wearableData')
const User = require('../../models/user')
const auth = require("../middleware/auth");

// Recieve data from device
router.post('/ward/:deviceId/data', async (req, res) => {
	try {
		const device = await Devices.findOne({deviceId:req.params.deviceId, type:'ward'})
		const data = new WardData({
			...req.body,
			device:device._id,
		});
		await data.save();
		console.log(data);
		res.status(200).send(`${data}`)
	} catch (error) {
		res.status(404).send(error);
	}
})

// Viewing data
router.get('/ward/:deviceId/data', async (req, res) =>{
	try {
		const device = await Devices.findOne({deviceId:req.params.deviceId, type:'ward'})
		await device.populate({
			path:'wardData',
			options: {
				sort: {createdAt: -1},
				limit:1
			}
		}).execPopulate()
		res.status(200).send(device.wardData)
	} catch (error) {
		res.status(500).send(error);
	}
})

module.exports = router;