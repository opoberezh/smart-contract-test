const { ethers } = require("hardhat");

async function deployContracts() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Load compiled contracts
  const SolarGreenToken = await ethers.getContractFactory("SolarGreenToken");
  const TokenSale = await ethers.getContractFactory("TokenSale");

  console.log("Contract factories loaded successfully.");

  // Deploy SolarGreenToken contract
  const solarGreenToken = await SolarGreenToken.deploy(1000000);
  const solarGreenTokenDeployment =
    await solarGreenToken.deployTransaction.wait(); // Wait for deployment transaction to be mined
  console.log(
    "SolarGreenToken deployed to:",
    solarGreenTokenDeployment.contractAddress
  );

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
    deployer.address // Pass initialOwner as deployer address
  );
  const tokenSaleDeployment = await tokenSale.deployTransaction.wait(); // Wait for deployment transaction to be mined
  console.log("TokenSale deployed to:", tokenSaleDeployment.contractAddress);

  console.log("Deployment completed successfully.");
}

deployContracts().then(() => process.exit(0));
