const express = require("express");
const router = new express.Router();
const Device = require("../../models/device");
const Data = require('../../models/data')
const User = require('../../models/user')
const auth = require("../middleware/auth");

router.all("/*", (req, res, next) => {
	req.app.locals.layout = "layouts/main";
	next();
});

router.get('/users/signIn', (req,res) => {
	res.render('signIn', {layout: 'layouts/main'})
})
router.get('/users/addDevice', (req,res) => {
	res.render('addDevice')
})

//View Data for a device
router.get('/users/:deviceId/data',auth, async (req, res) =>{
	try {
		const device = await Device.findOne({deviceId:req.params.deviceId})
		await device.populate({
			path:'data',
			options: {
				sort: {createdAt: -1},
				limit:10
			}
		}).execPopulate()
	
		res.status(200).render('data', {
			data:device.data,
			cTemp:device.data[0].temperature,
			cPulse: device.data[0].pulse,
			deviceId:req.params.deviceId,
		})
	} catch (error) {
		res.status(500).send(error);
	}
})
// Add Device
router.patch("/users/addDevice", auth, async (req, res) => {
	try {
		const device = req.body.deviceName
		req.user.devices=req.user.devices.concat({device})
		await req.user.save()
		res.status(201).render('home',{devices:req.user.devices})
	} catch (error) {
		res.status(500).send(error);
	}
});
// Sign In
router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		// sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.status(201).render('index', {message:"Sign In successful, Please Log In.",layout: 'layouts/main'})
	} catch (err) {
		res.status(400).send(err);
	}
});
// Log In
router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.cookie('authToken',token)
		.render('home', {devices:user.devices, layout:'layouts/main'})
	} catch (error) {
		res.status(400).send('Unable to Login');
	}
});
// Log Out
router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token != req.token;
		});
		await req.user.save();
		res.status(200).render('index',{message:"Logout successful"});
	} catch (e) {
		res.status(500).send();
	}
});

router.get('/users/*' , (req,res) => {
	res.render('index', {layout:'layouts/main'})
})
router.get('/wearable/:deviceId', (req,res) => {
	res.render('wearable', {
		deviceId:req.params.deviceId,layout:'layouts/main'})
})

module.exports = router;