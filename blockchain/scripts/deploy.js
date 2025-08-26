const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying EmergencyLedger contract...");
  
  // The contract constructor requires an address for the 'allowedLogger'
  // We will use the first account provided by Hardhat (the deployer) for now.
  // Later, this will be a dedicated wallet from our backend.
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory and deploy
  const EmergencyLedger = await ethers.getContractFactory("EmergencyLedger");
  const emergencyLedger = await EmergencyLedger.deploy(deployer.address); // Pass the allowedLogger address

  // Wait for the deployment to be confirmed
  await emergencyLedger.waitForDeployment();
  const contractAddress = await emergencyLedger.getAddress();

  console.log("EmergencyLedger deployed to:", contractAddress);
  console.log("Transaction hash:", emergencyLedger.deploymentTransaction().hash);

  // For later use, we can save the contract address to a file or environment variable
  // This is crucial for the backend to know where to find the contract.
  console.log("\n*** NEXT STEP ***");
  console.log(`Set CONTRACT_ADDRESS=${contractAddress} in your backend .env file`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
