require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Connect to Database
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json()); // Important for receiving GPS data

// 3. Routes
app.use('/api/gps', require('./routes/gpsRoutes'));

// 4. Base Route
app.get('/', (req, res) => 
    res.send('🚀 Tulia API: Operational and Listening')
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => 
    console.log(`🚀 Tulia Backend running on port ${PORT}`)
);
