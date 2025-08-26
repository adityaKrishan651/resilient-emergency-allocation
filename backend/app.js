const express = require('express');
const cors = require('cors');
const { syncModels } = require('./models');
const emergencyRequestRoutes = require('./routes/emergencyRequestRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const allocationRoutes = require('./routes/allocationRoutes');
const syncService = require('./services/syncService');

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/requests', emergencyRequestRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/allocate', allocationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
});

// Initialize Database and Start Server
const startServer = async () => {
    await syncModels(); // Ensure DB is connected and models are synced

	syncService.start();

    app.listen(PORT, () => {
        console.log(`Backend server is running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
