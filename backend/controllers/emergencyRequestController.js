const { EmergencyRequest } = require('../models');

// @desc    Create a new emergency request
// @route   POST /api/requests
// @access  Public (for now, add auth later if needed)
//
const createRequest = async (req, res) => {
    try {
        const { location, urgency, type } = req.body;

        if (!location || !urgency || !type) {
            return res.status(400).json({ error: 'Location, urgency, and type are required fields.' });
        }

        const newRequest = await EmergencyRequest.create({
            location, // Expects GeoJSON: { type: 'Point', coordinates: [longitude, latitude] }
            // If using separate lat/long columns:
            // latitude: req.body.latitude,
            // longitude: req.body.longitude,
            urgency,
            type
        });

        res.status(201).json({
            message: 'Emergency request created successfully.',
            request: newRequest
        });
    } catch (error) {
        console.error('Error creating emergency request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// @desc    Get all emergency requests
// @route   GET /api/requests
// @access  Public
const getAllRequests = async (req, res) => {
    try {
        const requests = await EmergencyRequest.findAll({
            order: [['createdAt', 'DESC']] // Get most recent requests first
        });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching emergency requests:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// @desc    Get a single emergency request by ID
// @route   GET /api/requests/:id
// @access  Public
const getRequestById = async (req, res) => {
    try {
        const request = await EmergencyRequest.findByPk(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Emergency request not found.' });
        }
        res.status(200).json(request);
    } catch (error) {
        console.error('Error fetching emergency request:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById
};
