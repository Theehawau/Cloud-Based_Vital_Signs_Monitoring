const express = require("express");
const router = new express.Router();
const Devices = require("../../models/devices");
const User = require('../../models/wardUser')
const auth = require("../middleware/auth");

router.get('/ward', (req,res) => {
	res.render('wardIndex')
})
router.get('/ward/users/signIn', (req,res) => {
	res.render('wardSignIn', {layout: 'layouts/main'})
})

// Sign In
router.post("/ward/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).render('wardIndex', {message:"Sign In successful, Please Log In.",layout: 'layouts/main'})
	} catch (err) {
		res.status(400).send(err);
	}
});

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
				sort: {createdAt: -1}
			}
		}).execPopulate()
		res.status(200).send(device.wardData)
		// res.render('ward', {data:device.wardData ,layout:'layouts/main'})
	} catch (error) {
		res.status(500).send(error);
	}
})

// Login
router.post("/ward/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		const device = await Devices.findOne({deviceId:user.deviceId, type:'ward'})
		await device.populate({
			path:'wardData',
			options: {
				sort: {createdAt: -1}
			}
		}).execPopulate()
		console.log(device.wardData);
		res.cookie('authToken',token)
		.render('ward', {data:device.wardData, layout:'layouts/main'})
	} catch (error) {
		console.log(error)
		res.status(400).send('Unable to Login');
	}
});
// Log Out
router.post("/ward/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.status(200).render('wardIndex',{message:"Logout successful"});
	} catch (e) {
		res.status(500).send();
	}
});
module.exports = router;