const express = require('express');
const { createResource, getAllResources, getResourceById } = require('../controllers/resourceController');

const router = express.Router();

router.post('/', createResource);
router.get('/', getAllResources);
router.get('/:id', getResourceById);
// We will add PATCH /:id for updates and allocation in a later step.

module.exports = router;
