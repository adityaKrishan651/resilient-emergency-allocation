const { EmergencyRequest, Resource } = require('../models');
const { findNearestResource } = require('../services/allocationService');
const blockchainService = require('../services/blockchainService'); // Import the new service
const FallbackService = require('../services/fallbackService');

const allocateResourceToRequest = async (req, res) => {
    const transaction = await EmergencyRequest.sequelize.transaction();
    let allocationSuccessful = false;

    try {
        const requestId = req.params.requestId;
        const request = await EmergencyRequest.findByPk(requestId, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!request) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Emergency request not found.' });
        }

        if (request.status !== 'pending') {
            await transaction.rollback();
            return res.status(400).json({ error: `Request is already ${request.status}.` });
        }

        const nearestResource = await findNearestResource(requestId, request.type, request.location);
        if (!nearestResource) {
            await transaction.rollback();
            return res.status(404).json({ error: 'No available resources of the required type found.' });
        }

        const resourceToUpdate = await Resource.findByPk(nearestResource.id, {
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (resourceToUpdate.status !== 'available') {
            await transaction.rollback();
            return res.status(409).json({ error: 'Resource was allocated to another request just now.' });
        }

        // 1. UPDATE THE DATABASE
        request.status = 'allocated';
        await request.save({ transaction });
        resourceToUpdate.status = 'allocated';
        await resourceToUpdate.save({ transaction });
        await transaction.commit();
        allocationSuccessful = true; // Mark the DB update as successful

        // 2. ATTEMPT TO LOG ON THE BLOCKCHAIN
        const blockchainReceipt = await blockchainService.logAllocation(
            request.id,          // requestId
            resourceToUpdate.id, // resourceId
            request.type,        // requestType
            request.urgency      // urgency
        );

        // Check if the blockchain call had an error
        if (blockchainReceipt.error) {
            console.warn('Database allocation succeeded, but blockchain logging failed:', blockchainReceipt.error);
            // We still respond successfully because the core allocation worked.
            // The fallback mechanism (later sync) will handle the blockchain sync.
		FallbackService.addFailedAllocation(
			request.id, 
			resourceToUpdate.id,
			request.type,
			request.urgency
		);
            return res.status(200).json({
                message: 'Resource allocated successfully, but could not log to blockchain. Will retry later.',
                request: request,
                allocatedResource: resourceToUpdate,
                blockchainError: blockchainReceipt.error
            });
        }

        // 3. SUCCESS - BOTH DB AND BLOCKCHAIN WORKED
        res.status(200).json({
            message: 'Resource allocated and transaction logged on blockchain successfully.',
            request: request,
            allocatedResource: resourceToUpdate,
            blockchainTransactionHash: blockchainReceipt.hash // Send the TX hash to the frontend
        });

    } catch (error) {
        // Rollback the database transaction only if it wasn't committed
        if (!allocationSuccessful) {
            await transaction.rollback();
        }
        console.error('Error during allocation process:', error);
        res.status(500).json({ error: 'Internal server error during allocation.' });
    }
};

module.exports = {
    allocateResourceToRequest
};
