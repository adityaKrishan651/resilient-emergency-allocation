const FallbackService = require('./fallbackService');
const blockchainService = require('./blockchainService');

class SyncService {
    constructor() {
        this.isSyncing = false;
        this.syncInterval = null;
    }

    start() {
        console.log('Starting background sync service...');
        // Check for failed allocations every 2 minutes
        this.syncInterval = setInterval(() => this.syncFailedAllocations(), 2 * 60 * 1000);
    }

    stop() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            console.log('Background sync service stopped.');
        }
    }

    async syncFailedAllocations() {
        if (this.isSyncing) return;
        
        this.isSyncing = true;
        const allocationsToRetry = FallbackService.getAllocationsToRetry();
        
        if (allocationsToRetry.length === 0) {
            this.isSyncing = false;
            return;
        }

        console.log(`Found ${allocationsToRetry.length} failed allocations to retry...`);

        for (const allocation of allocationsToRetry) {
            try {
                console.log(`Retrying blockchain log for request ${allocation.requestId}...`);
                const result = await blockchainService.logAllocation(
                    allocation.requestId,
                    allocation.resourceId,
                    allocation.requestType,
                    allocation.urgency
                );

                if (result.error) {
                    console.warn(`Retry failed for request ${allocation.requestId}:`, result.error);
                    FallbackService.updateRetryStatus(allocation.key, false);
                } else {
                    console.log(`✅ Successfully synced allocation for request ${allocation.requestId}`);
                    FallbackService.updateRetryStatus(allocation.key, true);
                }
            } catch (error) {
                console.error(`Error during retry for request ${allocation.requestId}:`, error);
                FallbackService.updateRetryStatus(allocation.key, false);
            }
            
            // Small delay between retries to avoid overwhelming the node
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.isSyncing = false;
    }
}

// Create and export a singleton instance
const syncService = new SyncService();
module.exports = syncService;
