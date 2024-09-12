const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();
require('dotenv').config();

// Load addresses from the generated file
let addresses = require('./addresses.json');

// Limit to the first 500 addresses
addresses = addresses.slice(0, 500);

// Load deployed token address from deployedAddress.json
const deployedInfo = require(path.join(__dirname, '../scripts/deployedAddress.json'));
const tokenAddress = deployedInfo.tokenAddress;

// Load ABI from artifacts folder
const tokenABI = require(path.join(__dirname, '../artifacts/contracts/TokenA.sol/TokenA.json')).abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL); // Replace with your RPC URL
const privateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(privateKey, provider);

const tokenContract = new ethers.Contract(tokenAddress, tokenABI, wallet);

const saveReceipt = (filename, data) => {
  fs.appendFileSync(filename, JSON.stringify(data, null, 2) + '\n', 'utf8');
};

const sendTokensIndividually = async () => {
  const receiptFile = 'individual_receipts.json';
  for (const address of addresses) {
    try {
      const amount = Math.floor(Math.random() * 999) + 1; // Random number between 1 and 999
      const tx = await tokenContract.transfer(address, ethers.utils.parseUnits(amount.toString(), 18));
      const receipt = await tx.wait();
      console.log(`Sent ${amount} tokens to ${address}`);
      console.log(`Transaction hash: ${receipt.transactionHash}`);

      // Save receipt details
      saveReceipt(receiptFile, {
        address,
        amount,
        transactionHash: receipt.transactionHash
      });
    } catch (error) {
      console.error(`Error sending tokens to ${address}:`, error);
    }
  }
};

const sendTokensInBatch = async () => {
  const receiptFile = 'batch_receipts.json';
  const batchSize = 1000;
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batchAddresses = addresses.slice(i, i + batchSize);
    const recipients = [];
    const amounts = [];

    for (const address of batchAddresses) {
      const amount = Math.floor(Math.random() * 999) + 1; // Random number between 1 and 999
      recipients.push(address);
      amounts.push(ethers.utils.parseUnits(amount.toString(), 18));
    }

    try {
      const tx = await tokenContract.batchTransfer(recipients, amounts);
      const receipt = await tx.wait();
      console.log(`Airdropped tokens to ${recipients.length} addresses`);
      console.log(`Transaction hash: ${receipt.transactionHash}`);

      // Save receipt details
      const receiptData = recipients.map((recipient, index) => ({
        address: recipient,
        amount: ethers.utils.formatUnits(amounts[index], 18)
      }));
      saveReceipt(receiptFile, {
        transactionHash: receipt.transactionHash,
        details: receiptData
      });
    } catch (error) {
      console.error("Error during batch transfer:", error);
    }
  }
};

const main = async () => {
  const transferType = prompt('Select transfer type (individual/batch): ');

  if (transferType === 'individual') {
    await sendTokensIndividually();
  } else if (transferType === 'batch') {
    await sendTokensInBatch();
  } else {
    console.error("Invalid transfer type. Use 'individual' or 'batch'.");
  }
};

main()
  .then(() => console.log("Airdrop complete"))
  .catch((error) => console.error("Error during airdrop:", error));