import { ethers } from "hardhat";
import hre from "hardhat";

async function main() {
  const Whitelist: any = await ethers.getContractFactory("SoulDrop");
  const whitelist = await Whitelist.deploy("X", "X", 12, 1 ,"Name", "Symbol");

  await whitelist.deployed();

  console.log("Whitelist Contract Deployed to : ", whitelist.address);

  //* Verification Process
  console.log("Waiting...");
  await sleep(60000);

  await hre.run("verify:verify", {
    address: whitelist.address,
    constructorArguments: [20],
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
