const { ethers } = require('ethers');
require('dotenv').config();

// Import the ABI (Application Binary Interface) of the contract.
// This is the JSON representation of the smart contract's interface.
// We will get this from the Hardhat compilation artifacts.
const EmergencyLedgerABI = require('../../blockchain/artifacts/contracts/EmergencyLedger.sol/EmergencyLedger.json').abi;

class BlockchainService {
    constructor() {
        // Initialize the provider to connect to the local Hardhat node
        this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
        
        // Initialize the wallet/signer using the private key from the .env file.
        // This wallet will be the "msg.sender" for our transactions.
        this.wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, this.provider);
        
        // Initialize the contract instance
        this.contract = new ethers.Contract(
            process.env.EMERGENCY_LEDGER_CONTRACT_ADDRESS,
            EmergencyLedgerABI,
            this.wallet // connect the signer to the contract for writing
        );

        console.log('BlockchainService initialized. Connected to contract at:', process.env.EMERGENCY_LEDGER_CONTRACT_ADDRESS);
    }

    /**
     * Logs a successful allocation to the blockchain.
     * @param {number} requestId - The backend DB ID of the request.
     * @param {number} resourceId - The backend DB ID of the resource.
     * @param {string} requestType - The type of emergency (e.g., 'medical').
     * @param {string} urgency - The urgency level (e.g., 'high').
     * @returns {Promise<Object>} The blockchain transaction receipt.
     */
    async logAllocation(requestId, resourceId, requestType, urgency) {
        try {
            console.log(`Attempting to log allocation to blockchain: Request ${requestId}, Resource ${resourceId}`);
            
            // Call the smart contract function
            const tx = await this.contract.logAllocation(
                requestId,
                resourceId,
                requestType,
                urgency
            );

            // Wait for the transaction to be mined (added to a block)
            const receipt = await tx.wait();
            console.log('Allocation successfully logged on blockchain. Transaction Hash:', receipt.hash);
            
            return receipt;

        } catch (error) {
            console.error('Failed to log allocation on blockchain:', error);
            // It's important to not throw here if we want the fallback to work.
            // We'll just return the error and let the controller handle it.
            return { error: error.message };
        }
    }

    // Singleton pattern to avoid multiple connections
    static getInstance() {
        if (!BlockchainService.instance) {
            BlockchainService.instance = new BlockchainService();
        }
        return BlockchainService.instance;
    }
}

// Create a single instance and export it
const blockchainService = BlockchainService.getInstance();
module.exports = blockchainService;
