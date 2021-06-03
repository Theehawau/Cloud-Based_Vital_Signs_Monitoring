const express = require("express");
const router = new express.Router();
const Devices = require("../../models/devices");
const WardData = require('../../models/wardData');
const WearableData = require('../../models/wearableData')
// REgister new device
router.post("/newdevicetype", async (req, res) => {
	try {
		const device = new Devices(req.body);
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
