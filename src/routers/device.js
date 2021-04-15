const express = require("express");
const router = new express.Router();
const Device = require("../../models/device");
const Data = require('../../models/data')
// REgister new device
router.post("/newdevice", async (req, res) => {
	try {
		const device = new Device(req.body);
		await device.save();
		res.status(200).send(`Created new device ${device}`);
	} catch (err) {
		res.status(404).send(err);
	}
});
// Set user details
router.patch("/:deviceId/patientDetail", async (req,res) => {
	const updates = Object.keys(req.body)
	try {
		const device = await Device.findOne({deviceId:req.params.deviceId})
		if (!device) return res.status(404).send()
		updates.forEach(update => device[update] = req.body[update])
        await device.save()
        res.status(200).send('Device Updated')
	} catch (error) {
		res.status(500).send(error);
	}
})

module.exports = router;
