const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// POST: Receive GPS data from hardware/device
router.post('/update', async (req, res) => {
    try {
        const { deviceId, latitude, longitude, battery, speed } = req.body;

        // Input validation
        if (!deviceId || latitude == null || longitude == null) {
            return res.status(400).json({
                success: false,
                message: "deviceId, latitude, and longitude are required"
            });
        }

        // Convert to proper numbers
        const newLocation = new Location({
            deviceId: deviceId.trim(),
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            battery: battery !== undefined ? parseFloat(battery) : undefined,
            speed: speed !== undefined ? parseFloat(speed) : undefined
        });

        await newLocation.save();

        console.log(`📍 Location saved → Device: ${deviceId} | Lat: ${latitude}, Lng: ${longitude}`);

        res.status(201).json({
            success: true,
            message: "Location saved successfully",
            data: {
                id: newLocation._id,
                timestamp: newLocation.timestamp
            }
        });
    } catch (err) {
        console.error('Error saving GPS data:', err.message);
        res.status(500).json({
            success: false,
            message: "Failed to save location"
        });
    }
});

// GET: Get latest location for a specific device
router.get('/latest/:deviceId', async (req, res) => {
    try {
        const latest = await Location.findOne({ 
            deviceId: req.params.deviceId 
        }).sort({ timestamp: -1 });

        if (!latest) {
            return res.status(404).json({
                success: false,
                message: "No location data found for this device"
            });
        }

        res.json({
            success: true,
            data: latest
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;