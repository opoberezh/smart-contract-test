require("@nomicfoundation/hardhat-ethers");

const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.API_KEY;
const MNEMONIC = process.env.MNEMONIC;

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${API_KEY}`,
      accounts: { mnemonic: MNEMONIC },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },

  external: {
    contracts: [
      {
        artifacts: "./artifacts",
        deploy: "./deploy.js",
      },
    ],
  },
};
