const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SolarGreenToken", function () {
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let SolarGreenToken;
  let store;

  beforeEach(async function () {
    //get the contract Factory SolarGreenToken
    SolarGreenToken = await ethers.getContractFactory("SolarGreenToken", owner);

    //get objs Signer for owner and addr1, and arr addrs with other Signer
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    //deploy of SGT contract
    store = await SolarGreenToken.deploy(owner);

    //wait for contract deploying
    await store.deployed();
  });

  it("Should mint tokens to contract address", async function () {
    expect(await store.owner()).to.equal(owner.address);
    expect(await store.symbol()).to.equal("SGR");
    const initialContractBalance = await store.balanceOf(store.address);
    expect(initialContractBalance).to.equal(0); //check if balance of tokens equal 0

    const amountToMint = 500;
    await store.mint(store.address, amountToMint); // to call func mint to add 500 tokens

    const finalContractBalance = await store.balanceOf(store.address);
    expect(finalContractBalance).to.equal(amountToMint); //check if balance of SGT contract = amountToMint
  });

  it("Should add and remove address from blacklist", async function () {
    //add addr to blacklist
    await store.addToBlacklist(addr1.address);
    expect(await store.isBlacklist(addr1.address).to.equal(true));

    //remove address from blacklist
    await store.removeFromBlacklist(addr1.address);
    expect(await store.isBlacklist(addr1.address)).to.equal(false);
  });

  it("Should work correctly for different addresses", async function () {
    // Add addr1 to blacklist
    await store.addToBlacklist(addr1.address);
    expect(await store.isBlacklist(addr1.address)).to.equal(true);

    // Add addr2 to blacklist
    await store.addToBlacklist(addr2.address);
    expect(await store.isBlacklist(addr2.address)).to.equal(true);

    // Remove addr1 from blacklist
    await store.removeFromBlacklist(addr1.address);
    expect(await store.isBlacklist(addr1.address)).to.equal(false);

    // Ensure addr2 is still in the blacklist
    expect(await store.isBlacklist(addr2.address)).to.equal(true);
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
    expect(finalBalance.sub(initialBalance)).to.equal(amountToMint);
  });

  it("Should burn tokens from sender's balance", async function () {
    const initialBalance = await store.balanceOf(owner.address);
    const amountToBurn = 50;

    await store.burn(amountToBurn);

    const finalBalance = await store.balanceOf(owner.address);
    expect(initialBalance.sub(finalBalance)).to.equal(amountToBurn);
  });
});
