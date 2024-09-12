const fs = require('fs');
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Network:", network.name);

  const TokenA = await ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy(deployer.address);

  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);

  // Save the deployed address to a JSON file
  const deployedInfo = {
    tokenAddress: tokenA.address,
    deployerAddress: deployer.address,
    network: network.name
  };

  fs.writeFileSync('scripts/deployedAddress.json', JSON.stringify(deployedInfo, null, 2));
  console.log("Deployed address saved to deployedAddress.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
