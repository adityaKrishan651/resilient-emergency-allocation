const express = require('express');
const { allocateResourceToRequest } = require('../controllers/allocationController');

const router = express.Router();

router.post('/:requestId', allocateResourceToRequest);

module.exports = router;
