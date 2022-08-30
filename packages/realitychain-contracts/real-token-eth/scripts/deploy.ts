// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import hre from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const networkName = hre.network.name;
  console.log("Deploying to network: ", networkName);

  // We get the contract to deploy
  const realTokenEthContract = await hre.ethers.getContractFactory(
    "RealToken_deploy"
  );
  console.log("Deploying RealToken_deploy...");
  const realTokenEthDeployed = await realTokenEthContract.deploy();

  await realTokenEthDeployed.deployed();

  console.log("Token deployed to:", realTokenEthDeployed.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
