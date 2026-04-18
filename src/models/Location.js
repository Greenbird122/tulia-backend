const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    battery: {
        type: Number,
        min: 0,
        max: 100
    },
    speed: {
        type: Number,
        min: 0
    }
});

// Compound index for fast latest location queries
LocationSchema.index({ deviceId: 1, timestamp: -1 });

module.exports = mongoose.model('Location', LocationSchema);