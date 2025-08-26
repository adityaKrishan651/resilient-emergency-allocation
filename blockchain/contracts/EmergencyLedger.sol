// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EmergencyLedger {

    // Event emitted when a resource is allocated to a request
    event AllocationLogged(
        uint256 indexed requestId,
        uint256 indexed resourceId,
        string requestType,
        string urgency,
        address allocatedBy,
        uint256 timestamp
    );

    // Address that is allowed to log allocations (will be our backend server's wallet)
    address public allowedLogger;

    // Constructor to set the allowed logger address
    constructor(address _allowedLogger) {
        allowedLogger = _allowedLogger;
    }

    /**
     * @dev Function to log an allocation on the blockchain.
     * Basic access control - only the allowed logger can call this function.
     */
    function logAllocation(
        uint256 _requestId,
        uint256 _resourceId,
        string calldata _requestType,
        string calldata _urgency
    ) external {
        // Simple access control
        require(msg.sender == allowedLogger, "Only allowed logger can perform this action");
        
        // Log the allocation with a timestamp
        emit AllocationLogged(
            _requestId,
            _resourceId,
            _requestType,
            _urgency,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Function to update the allowed logger address (for future flexibility)
     */
    function setAllowedLogger(address _newLogger) external {
        require(msg.sender == allowedLogger, "Only current logger can change this");
        allowedLogger = _newLogger;
    }
}
