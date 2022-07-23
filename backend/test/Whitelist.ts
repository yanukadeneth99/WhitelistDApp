import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Whitelist Testing, max = 3", function () {
  async function deployTokenFixture() {
    const Whitelist = await ethers.getContractFactory("Whitelist");
    const [owner, addr1, addr2, addr3, addr4, addr5] =
      await ethers.getSigners();
    const whitelist = await Whitelist.deploy(3);
    await whitelist.deployed();
    return { Whitelist, whitelist, owner, addr1, addr2, addr3, addr4, addr5 };
  }

  it("Check Initial Values", async function () {
    const { whitelist } = await loadFixture(deployTokenFixture);
    expect(await whitelist.maxWhitelistedAddresses()).to.equal(3);
    expect(await whitelist.getNumberOfWhitelist()).to.equal(0);
  });

  it("Adding/Removing Addresses", async function () {
    // Getting material
    const { whitelist, addr1, addr2, owner } = await loadFixture(
      deployTokenFixture
    );

    // Address 1
    await expect(whitelist.connect(addr1).joinWhitelist())
      .to.emit(whitelist, "userWhitelisted")
      .withArgs(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
    expect(await whitelist.getNumberOfWhitelist()).to.equal(1);

    // Adding in Address 2
    await expect(whitelist.connect(addr2).joinWhitelist())
      .to.emit(whitelist, "userWhitelisted")
      .withArgs(addr2.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
    expect(await whitelist.isWhitelisted(addr2.address)).to.be.true;
    expect(await whitelist.getNumberOfWhitelist()).to.equal(2);

    // Deleting Address 1
    await expect(whitelist.connect(owner).removeWhitelist(addr1.address))
      .to.emit(whitelist, "userRemoved")
      .withArgs(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.false;
    expect(await whitelist.isWhitelisted(addr2.address)).to.be.true;
    expect(await whitelist.getNumberOfWhitelist()).to.equal(1);

    // Other user cannot remove whitelist
    await expect(
      whitelist.connect(addr2).removeWhitelist(owner.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    // Check error when removing whitelist that are already removed
    await expect(
      whitelist.connect(owner).removeWhitelist(addr1.address)
    ).to.be.revertedWith("Address not a whitelist!");
  });

  it("Adding more Addresses", async function () {
    // Getting material
    const { whitelist, addr1, addr2, addr3, addr4, addr5 } = await loadFixture(
      deployTokenFixture
    );

    // Address 1
    await expect(whitelist.connect(addr1).joinWhitelist())
      .to.emit(whitelist, "userWhitelisted")
      .withArgs(addr1.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
    expect(await whitelist.getNumberOfWhitelist()).to.equal(1);

    // Adding in Address 2
    await expect(whitelist.connect(addr2).joinWhitelist())
      .to.emit(whitelist, "userWhitelisted")
      .withArgs(addr2.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
    expect(await whitelist.isWhitelisted(addr2.address)).to.be.true;
    expect(await whitelist.getNumberOfWhitelist()).to.equal(2);

    // Adding Address 3
    await expect(whitelist.connect(addr3).joinWhitelist())
      .to.emit(whitelist, "userWhitelisted")
      .withArgs(addr3.address);
    expect(await whitelist.isWhitelisted(addr1.address)).to.be.true;
    expect(await whitelist.isWhitelisted(addr2.address)).to.be.true;
    expect(await whitelist.isWhitelisted(addr3.address)).to.be.true;
    expect(await whitelist.getNumberOfWhitelist()).to.equal(3);
    expect(await whitelist.maxWhitelistedAddresses()).to.equal(3);

    // Error when re-adding any of the addressess
    await expect(whitelist.connect(addr1).joinWhitelist()).to.be.revertedWith(
      "Address already a whitelist"
    );
    await expect(whitelist.connect(addr2).joinWhitelist()).to.be.revertedWith(
      "Address already a whitelist"
    );
    await expect(whitelist.connect(addr3).joinWhitelist()).to.be.revertedWith(
      "Address already a whitelist"
    );

    // Adding more addresses than it can
    await expect(whitelist.connect(addr4).joinWhitelist()).to.be.revertedWith(
      "Max Whitelist amount reached!"
    );
    expect(await whitelist.getNumberOfWhitelist()).to.not.equal(4);
    expect(await whitelist.getNumberOfWhitelist()).to.equal(3);
    expect(await whitelist.maxWhitelistedAddresses()).to.equal(3);
  });
});
