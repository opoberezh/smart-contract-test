const { ethers } = require("hardhat");

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Load compiled contracts
  const SolarGreenToken = await ethers.getContractFactory("SolarGreenToken");
  const TokenSale = await ethers.getContractFactory("TokenSale");

  console.log("Contract factories loaded successfully.");

  try {
    // Deploy SolarGreenToken contract
    const solarGreenToken = await SolarGreenToken.deploy(1000000);
    await solarGreenToken.deployed(); // Wait for deployment to be confirmed
    console.log("SolarGreenToken deployed to:", solarGreenToken.address);

    // Deploy TokenSale contract
    const saleRate = 1000; // Sale rate for tokens
    const saleCap = 50000000; // Total sale cap (50 million tokens)
    const duration = 5 * 7 * 24 * 3600; // 5 weeks in seconds
    const usdtAddress = "0x1531BC5dE10618c511349f8007C08966E45Ce8ef"; // Address of the chosen stablecoin (e.g., USDT or USDC)
    console.log("USDT Contract Address:", usdtAddress);
    const tokenSale = await TokenSale.deploy(
      solarGreenToken.address,
      saleRate,
      saleCap,
      duration,
      deployer.address, // Pass initialOwner as deployer address
      usdtAddress
    );
    await tokenSale.deployed(); // Wait for deployment to be confirmed
    console.log("TokenSale deployed to:", tokenSale.address);

    console.log("Deployment completed successfully.");
  } catch (error) {
    console.error("Error deploying contracts:", error);
    process.exit(1);
  }
}

deployContracts().then(() => process.exit(0));
