const express = require("express");
const router = new express.Router();
const Devices = require("../../models/devices");
// const WearableDevice = require('../../models/wearableDevice')
const WearableData = require('../../models/wearableData')

// // REgister new device
// router.post("/wearable/new", async (req, res) => {
// 	try {
// 		const device = new WearableDevice(req.body);
// 		await device.save();
// 		res.status(200).send(`Created new device ${device}`);
// 	} catch (err) {
// 		res.status(404).send(err);
// 	}
// });
// Recieve data from device
router.post('/wearable/:deviceId/data', async (req, res) => {
	try {
		const device = await Devices.findOne({deviceId:req.params.deviceId})
		const data = new WearableData({
			...req.body,
			device: device._id
		});
		await data.save();
		res.status(200).send(`${data}`)
	} catch (error) {
		res.status(404).send(error);
	}
})
router.get('/wearable/:deviceId/data', async (req, res) =>{
	try {
		const device = await Devices.findOne({deviceId:req.params.deviceId, type:'wearable'})
		await device.populate({
			path:'wearableData',
			options: {
				sort: {createdAt: -1},
				limit:1
			}
		}).execPopulate()
		res.status(200).send(device.wearableData)
	} catch (error) {
		res.status(500).send(error);
	}
})







module.exports = router