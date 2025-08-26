// Simple in-memory store for failed blockchain transactions (for prototype)
// In production, you would use a database table for this.
const failedAllocations = new Map();

const FallbackService = {
  /**
   * Store a failed allocation for later retry
   */
  addFailedAllocation(requestId, resourceId, requestType, urgency) {
    const key = `alloc_${requestId}_${resourceId}`;
    failedAllocations.set(key, {
      requestId,
      resourceId,
      requestType,
      urgency,
      retryCount: 0,
      lastAttempt: new Date()
    });
    console.log(`Added failed allocation to fallback queue: Request ${requestId}, Resource ${resourceId}`);
  },

  /**
   * Get all failed allocations that need retrying
   */
  getAllocationsToRetry() {
    const now = new Date();
    const toRetry = [];
    
    for (const [key, allocation] of failedAllocations.entries()) {
      // Simple retry logic: retry every 5 minutes, max 3 attempts
      const shouldRetry = allocation.retryCount < 3 && 
                         (now - allocation.lastAttempt) > 5 * 60 * 1000;
      
      if (shouldRetry) {
        toRetry.push({ ...allocation, key });
      }
    }
    
    return toRetry;
  },

  /**
   * Update retry information after an attempt
   */
  updateRetryStatus(key, success) {
    if (success) {
      failedAllocations.delete(key);
    } else {
      const allocation = failedAllocations.get(key);
      if (allocation) {
        allocation.retryCount += 1;
        allocation.lastAttempt = new Date();
        failedAllocations.set(key, allocation);
      }
    }
  },

  /**
   * Get stats for monitoring
   */
  getStats() {
    return {
      pending: failedAllocations.size,
      items: Array.from(failedAllocations.values())
    };
  }
};

module.exports = FallbackService;
