const { ethers } = require("ethers");
const fs = require('fs');
const path = require('path');

const seedPhrase = "test test test test test test test test test test test junk"; // Sample seed phrase
const hdNode = ethers.utils.HDNode.fromMnemonic(seedPhrase);

const generateAddresses = (count) => {
  const addresses = [];
  for (let i = 0; i < count; i++) {
    const wallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
    addresses.push(wallet.address);
  }
  return addresses;
};

const addresses = generateAddresses(10000);
fs.writeFileSync(path.join(__dirname, 'addresses.json'), JSON.stringify(addresses, null, 2));
console.log("Generated 10,000 addresses and saved to addresses.json");
