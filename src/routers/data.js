const express = require("express");
const router = new express.Router();
const Device = require("../../models/device");
const Data = require('../../models/data')
const TelegramUser = require('../../models/telegramUser')
const {sendErrorMessage} = require('../telegram')
// Send data from device
router.post('/:deviceId/data', async (req, res) => {
	try {
		const device = await Device.findOne({deviceId:req.params.deviceId})
		const data = new Data({
			...req.query,
			device: device._id,
			gender:device.patientGender,
			age:device.patientAge
		});
		await data.save();
		if (req.query.fatal == 'true'){	
			const users = await TelegramUser.find({}, 'chatId').exec();
			let chatIds = []
			users.forEach(user => {
				chatIds.push(user.chatId)
				sendErrorMessage(user.chatId, `Fatal Vital Signs for patient on ${req.params.deviceId}.See patient Now!!! 
									Vital Signs:
									Temperature:${req.query.temperature}°C, Pulse rate:${req.query.pulse}bpm`)
			})
			res.status(200).send(`${chatIds}`)
		}else{
			res.status(200).send(`${data}`)
		}
	} catch (error) {
		res.status(404).send(error);
	}
})

// Viewing data
router.get('/:deviceId/data', async (req, res) =>{
	try {
		const device = await Device.findOne({deviceId:req.params.deviceId})
		await device.populate({
			path:'data',
			options: {
				sort: {createdAt: -1}
			}
		}).execPopulate()
		res.status(200).send(device.data)
	} catch (error) {
		res.status(500).send(error);
	}
})

module.exports = router;