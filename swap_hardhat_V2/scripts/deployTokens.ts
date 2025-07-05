import { ethers as hardhatEthers } from "hardhat";

async function main() {
  const Token = await hardhatEthers.getContractFactory("tokens_erc20");
  console.log("Deploying token contract...");
  const token = await Token.deploy("Token2", "T2");
  await token.waitForDeployment();
  console.log("Token déployé à :", token.target);
}

main().catch(console.error);


