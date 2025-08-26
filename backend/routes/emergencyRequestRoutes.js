const express = require('express');
const { createRequest, getAllRequests, getRequestById } = require('../controllers/emergencyRequestController');

const router = express.Router();

router.post('/', createRequest);
router.get('/', getAllRequests);
router.get('/:id', getRequestById);
// We will add PATCH /:id for updates and allocation in a later step.

module.exports = router;
