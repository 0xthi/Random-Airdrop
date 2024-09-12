const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load addresses from the generated file
const addresses = require('./addresses.json');

// Load deployed token address from deployedAddress.json
const deployedInfo = require(path.join(__dirname, '../scripts/deployedAddress.json'));
const tokenAddress = deployedInfo.tokenAddress;

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // Replace with your RPC URL
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const tokenABI = [
  "function transfer(address to, uint amount) public returns (bool)"
];
const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

const sendTokens = async () => {
  for (const address of addresses) {
    try {
      const amount = Math.floor(Math.random() * 999) + 1; // Random number between 1 and 999
      const tx = await tokenContract.transfer(address, ethers.utils.parseUnits(amount.toString(), 18));
      await tx.wait();
      console.log(`Airdropped ${amount} tokens to ${address}`);
    } catch (error) {
      console.error(`Error sending tokens to ${address}:`, error);
    }
  }
};

sendTokens()
  .then(() => console.log("Airdrop complete"))
  .catch((error) => console.error("Error during airdrop:", error));