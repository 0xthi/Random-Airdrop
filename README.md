# Random Airdrop EVM

A token is created and preminted to the owner. 10,000 addresses will be generated from a seed phrase using `generateAddresses.js` script and tokens will be airdropped in random amount (from 1 to 999) to all 10,000 addresses individually using `airdrop.js` script

Clone and follow the below command lines.

1.Use npm package installer and install packages
```
npm install
```
2.Setup `.env`
```
PRIVATE_KEY=""
ETHERSCAN_API_KEY=
RPC_URL="https://...."
```
3.Compile contracts using hardhat
```
npx hardhat compile
```
3.Deploy contracts by running deploy script
```
npx hardhat run scripts/deploy.js --network <network-name>
```
4.Verify contracts by running verify command
```
npx hardhat verify --network <network-name> 0xtokenAddress 0xdeployerAddress
```
5.Generate 10,000 addresses running this script
```
node services/generateAddresses.js
```
6.Airdrop to all addresses individually
```
node services/airdrop.js
```
