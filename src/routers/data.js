const express = require("express");
const router = new express.Router();
const Device = require("../../models/device");
const Data = require('../../models/data')
const User = require('../../models/user')
const auth = require("../middleware/auth");
const TelegramUser = require('../../models/telegramUser')
const {sendErrorMessage} = require('../telegram')
// Recieve data from device
router.post('/:deviceId/data', async (req, res) => {
	try {
		const device = await Device.findOne({deviceId:req.params.deviceId})
		const data = new Data({
			...req.body,
			device: device._id,
			gender:device.patientGender,
			age:device.patientAge
		});
		await data.save();
		if (req.body.fatal == 'true'){	
			const users = await TelegramUser.find({}, 'chatId').exec();
			// let chatIds = []
			const message = `Fatal Vital Signs for patient on ${req.params.deviceId}.See patient Now!!! 
				Vital Signs:
				Temperature:${req.body.temperature}°C, Pulse rate:${req.body.pulse}bpm`
			users.forEach(user => {
				// chatIds.push(user.chatId)
				sendErrorMessage(user.chatId,message)
			})
			res.status(200).send(`${message}`)
		}else{
			res.status(200).send(`${data}`)
		}
		// res.status(200).send(`${data}`)
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
				sort: {createdAt: -1},
				limit:10
			}
		}).execPopulate()
		let pulse = [];
		let time = [];
		device.data.forEach(data => {
			pulse.push(data.pulse);
			time.push(data.createdAt);
		});
		res.status(200).send({pulse,time})
	} catch (error) {
		res.status(500).send(error);
	}
})

module.exports = router;