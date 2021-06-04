const express = require("express");
const router = new express.Router();
const Devices = require("../../models/devices");
const WearableData = require('../../models/wearableData')
const User = require('../../models/wardUser')
const auth = require("../middleware/auth");
router.get('/wearable', (req,res) => {
	res.render('wearableIndex')
})
router.get('/wearable/users/signIn', (req,res) => {
	res.render('wearableSignIn', {layout: 'layouts/main'})
})

// Sign In
router.post("/wearable/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).render('wearableIndex', {message:"Sign In successful, Please Log In.",layout: 'layouts/main'})
	} catch (err) {
		res.status(400).send(err);
	}
});
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
		res.status(200).send(device.wearableData[0])
	} catch (error) {
		res.status(500).send(error);
	}
})
// Login
router.post("/wearable/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		const device = await Devices.findOne({deviceId:user.deviceId, type:'wearable'})
		await device.populate({
			path:'wearableData',
			options: {
				sort: {createdAt: -1},
				limit: 1
			}
		}).execPopulate()
		console.log(device.wearableData[0]);
		res.cookie('authToken',token)
		.render('wearable', {data:device.wearableData[0],deviceId:user.deviceId, layout:'layouts/main'})
	} catch (error) {
		console.log(error)
		res.status(400).send('Unable to Login');
	}
});
// Log Out
router.post("/wearable/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.status(200).render('wearableIndex',{message:"Logout successful"});
	} catch (e) {
		res.status(500).send();
	}
});






module.exports = router