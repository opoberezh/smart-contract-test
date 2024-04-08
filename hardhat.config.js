require("@nomicfoundation/hardhat-ethers");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.API_KEY;
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: `https://sepolia.infura.io/v3/${API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
  },
};
