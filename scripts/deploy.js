// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const NAME = "NFT"
async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  
  const NFT = await hre.ethers.getContractFactory(NAME);
  const contract = await NFT.deploy(
    'friendly-skull',
    '',
    'FS',
    'ipfs://QmbNqy8zU3ZDLigbPv93n1WJk56xZzmxxZzSLE7pHZfjUr'
  );

  await contract.deployed();

  console.log("contract deployed to:", contract.address);
  saveFrontendFiles(contract)

}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ address: token.address }, undefined, 2)
  );

  const TokenArtifact = artifacts.readArtifactSync(NAME);

  fs.writeFileSync(
    contractsDir + "/NFT.json",
    JSON.stringify(TokenArtifact, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
