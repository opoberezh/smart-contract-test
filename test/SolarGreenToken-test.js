const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarGreenToken", function () {
  let owner;
  let addr1;
  let addr2;
  let store;
  let initialSupply;

  beforeEach(async function () {
    //get objs Signer for owner and addr1, and addr2
    [owner, addr1, addr2] = await ethers.getSigners();

    //get the contract Factory SolarGreenToken
    const SolarGreenToken = await ethers.getContractFactory(
      "SolarGreenToken",
      owner
    );

    //deploy of SGT contract
    initialSupply = 1000000;
    store = await SolarGreenToken.deploy(initialSupply);

    //wait for contract deploying and get the deployed contract
    // store = await store.deployed();
  });

  it("Should mint tokens to contract address", async function () {
    expect(await store.owner()).to.equal(owner.address);
    expect(await store.symbol()).to.equal("SGR");

    console.log(
      "Balance of owner:",
      (await store.balanceOf(owner.address)).toString()
    );

    const initialContractBalance = await store.balanceOf(owner.address);

    console.log("Initial contract balance:", initialContractBalance.toString());

    // console.log("ethers.utils:", ethers.utils);

    // const balance = ethers.utils.formatUnits(
    //   initialContractBalance.toString(),
    //   18
    // );

    expect(initialContractBalance).to.equal(initialSupply); //check if balance of tokens equal initial supply

    const amountToMint = 500;
    await store.mint(store.address, amountToMint); // to call func mint to add 500 tokens

    const finalContractBalance = await store.balanceOf(store.address);

    expect(finalContractBalance).to.equal(amountToMint); //check if balance of SGT contract = amountToMint
  });

  it("Should add and remove address from blacklist", async function () {
    //add addr to blacklist
    await store.addToBlacklist(addr1.address);
    expect(await store.isBlacklisted(addr1.address)).to.equal(true);

    //remove address from blacklist
    await store.removeFromBlacklist(addr1.address);
    expect(await store.isBlacklisted(addr1.address)).to.equal(false);
  });

  it("Should work correctly for different addresses", async function () {
    // Add addr1 to blacklist
    await store.addToBlacklist(addr1.address);
    expect(await store.isBlacklisted(addr1.address)).to.equal(true);

    // Add addr2 to blacklist
    await store.addToBlacklist(addr2.address);
    expect(await store.isBlacklisted(addr2.address)).to.equal(true);

    // Remove addr1 from blacklist
    await store.removeFromBlacklist(addr1.address);
    expect(await store.isBlacklisted(addr1.address)).to.equal(false);

    // Ensure addr2 is still in the blacklist
    expect(await store.isBlacklisted(addr2.address)).to.equal(true);
  });

  it("should allow only owner to add or remove addresses from blacklist", async function () {
    // Try to add address to blacklist as non-owner
    await expect(
      store.connect(addr1).addToBlacklist(addr2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    // Try to remove address from blacklist as non-owner
    await expect(
      store.connect(addr1).removeFromBlacklist(addr2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
  const { expect } = require("chai");
  const { ethers } = require("hardhat");

  describe("SolarGreenToken", function () {
    let owner;
    let addr1;
    let addr2;
    let store;
    let initialSupply;

    beforeEach(async function () {
      //get objs Signer for owner and addr1, and addr2
      [owner, addr1, addr2] = await ethers.getSigners();

      //get the contract Factory SolarGreenToken
      const SolarGreenToken = await ethers.getContractFactory(
        "SolarGreenToken",
        owner
      );

      //deploy of SGT contract
      initialSupply = ethers.utils.parseEther("1000000");
      store = await SolarGreenToken.deploy(initialSupply);

      //wait for contract deploying and get the deployed contract
      // store = await store.deployed();
    });

    it("Should mint tokens to contract address", async function () {
      expect(await store.owner()).to.equal(owner.address);
      expect(await store.symbol()).to.equal("SGR");

      console.log("Balance of owner:", await store.balanceOf(owner.address));

      const initialContractBalance = await store.balanceOf(owner.address);

      console.log(
        "Initial contract balance:",
        initialContractBalance.toString()
      );

      console.log("ethers.utils:", ethers.utils);

      const balance = ethers.utils.formatUnits(
        initialContractBalance.toString(),
        18
      );

      expect(balance).to.equal(initialSupply); //check if balance of tokens equal initial supply

      const amountToMint = 500;
      await store.mint(store.address, amountToMint); // to call func mint to add 500 tokens

      const finalContractBalance = await store.balanceOf(store.address);

      expect(finalContractBalance).to.equal(amountToMint); //check if balance of SGT contract = amountToMint
    });

    it("Should add and remove address from blacklist", async function () {
      //add addr to blacklist
      await store.addToBlacklist(addr1.address);
      expect(await store.isBlacklisted(addr1.address)).to.equal(true);

      //remove address from blacklist
      await store.removeFromBlacklist(addr1.address);
      expect(await store.isBlacklisted(addr1.address)).to.equal(false);
    });

    it("Should work correctly for different addresses", async function () {
      // Add addr1 to blacklist
      await store.addToBlacklist(addr1.address);
      expect(await store.isBlacklisted(addr1.address)).to.equal(true);

      // Add addr2 to blacklist
      await store.addToBlacklist(addr2.address);
      expect(await store.isBlacklisted(addr2.address)).to.equal(true);

      // Remove addr1 from blacklist
      await store.removeFromBlacklist(addr1.address);
      expect(await store.isBlacklisted(addr1.address)).to.equal(false);

      // Ensure addr2 is still in the blacklist
      expect(await store.isBlacklisted(addr2.address)).to.equal(true);
    });

    it("should allow only owner to add or remove addresses from blacklist", async function () {
      // Try to add address to blacklist as non-owner
      await expect(
        store.connect(addr1).addToBlacklist(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      // Try to remove address from blacklist as non-owner
      await expect(
        store.connect(addr1).removeFromBlacklist(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should mint tokens to specified address", async function () {
      const initialBalance = await store.balanceOf(addr1.address);
      const amountToMint = 100;

      await store.connect(owner).mint(addr1.address, amountToMint);

      const finalBalance = await store.balanceOf(addr1.address);

      expect(finalBalance).to.equal(initialBalance.add(amountToMint));
    });

    it("Should burn tokens from sender's balance", async function () {
      const initialBalance = await store.balanceOf(owner.address);
      const amountToBurn = 50;

      await store.burn(amountToBurn);

      const finalBalance = await store.balanceOf(owner.address);
      expect(initialBalance.sub(finalBalance)).to.equal(amountToBurn);
    });
  });

  it("Should mint tokens to specified address", async function () {
    const initialBalance = await store.balanceOf(addr1.address);
    const amountToMint = 100;

    await store.connect(owner).mint(addr1.address, amountToMint);

    const finalBalance = await store.balanceOf(addr1.address);

    expect(finalBalance).to.equal(initialBalance.add(amountToMint));
  });

  it("Should burn tokens from sender's balance", async function () {
    const initialBalance = await store.balanceOf(owner.address);
    const amountToBurn = 50;

    await store.burn(amountToBurn);

    const finalBalance = await store.balanceOf(owner.address);
    expect(initialBalance.sub(finalBalance)).to.equal(amountToBurn);
  });
});
