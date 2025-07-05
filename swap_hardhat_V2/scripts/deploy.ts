import { ethers as hardhatEthers } from "hardhat";

async function main() {
  const Swap = await hardhatEthers.getContractFactory("Swap");
  console.log("Deploying Swap contract...");
  const swap = await Swap.deploy();
  await swap.waitForDeployment();
  console.log("Swap deployed at:", swap.target);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });





