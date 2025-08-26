const { Resource } = require('../models');

// @desc    Create a new resource (van/driver)
// @route   POST /api/resources
// @access  Public (for now, likely admin-only later)
const createResource = async (req, res) => {
    try {
        const { name, type, location, driverId } = req.body;

        if (!name || !type || !location) {
            return res.status(400).json({ error: 'Name, type, and location are required fields.' });
        }

        const newResource = await Resource.create({
            name,
            type,
            location, // GeoJSON format
            driverId: driverId || null
        });

        res.status(201).json({
            message: 'Resource created successfully.',
            resource: newResource
        });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// @desc    Get a single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findByPk(req.params.id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found.' });
        }
        res.status(200).json(resource);
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = {
    createResource,
    getAllResources,
    getResourceById
};
