import { ethers as hardhatEthers } from "hardhat";
import { expect } from "chai";
import { parseEther  } from "ethers";

describe("Swap Contract", function () {
  let owner: any;
  let user: any;
  let tokenA: any;
  let tokenB: any;
  let swap: any;

  beforeEach(async () => {
    console.log("Début des tests du contrat Swap");
    [owner, user] = await hardhatEthers.getSigners();

    // Deploy MockToken (ERC20)
    const Token = await hardhatEthers.getContractFactory("MockToken");
    const deployTxA = await Token.deploy("Token A", "TKA", 18, parseEther("10000"));
    const deployTxB = await Token.deploy("Token B", "TKB", 18, parseEther("10000"));
    tokenA = await deployTxA.waitForDeployment();
    tokenB = await deployTxB.waitForDeployment();

    // Deploy contrat Swap
    const Swap = await hardhatEthers.getContractFactory("Swap");
    const deployedSwap = await Swap.deploy();
    await deployedSwap.waitForDeployment();
    swap = deployedSwap;

    // add token with their prices
    await swap.addToken(tokenA.target, parseEther("1"), "TokenA");
    await swap.addToken(tokenB.target, parseEther("2"), "TokenB");

    //approve token and add liquidity 
    await tokenA.approve(swap.target, parseEther("1000"));
    await tokenB.approve(swap.target, parseEther("2000"));

    await swap.addLiquidity(tokenA.target, parseEther("1000"));
    await swap.addLiquidity(tokenB.target, parseEther("2000"));

    // transfer tokens to user
    await tokenA.transfer(user.getAddress(), parseEther("100"));
    await tokenB.transfer(user.getAddress(), parseEther("100"));
  });

  it("should calculate correct swap rate", async () => {
    const rate = await swap.getSwapRate(tokenA.target, tokenB.target);
    expect(rate).to.equal(parseEther("2")); // tokenB == 2x tokenA
  });


it("should perform a token swap", async () => {
  const userTokenA = tokenA.connect(user);
  const userSwap = swap.connect(user);

  await userTokenA.approve(swap.target, parseEther("10"));


  const balanceBeforeA = await tokenA.balanceOf(user.getAddress());
  const balanceBeforeB = await tokenB.balanceOf(user.getAddress());

  await userSwap.swap(tokenA.target, tokenB.target, parseEther("10"));

  const balanceAfterA = await tokenA.balanceOf(user.getAddress());
  const balanceAfterB = await tokenB.balanceOf(user.getAddress());

  expect(balanceAfterA).to.be.lt(balanceBeforeA);
  expect(balanceAfterB - balanceBeforeB).to.equal(parseEther("20"));
});



  it("should revert if swap amount is zero", async () => {
    const userSwap = swap.connect(user);
    await expect(userSwap.swap(tokenA.target, tokenB.target, 0)).to.be.revertedWith(
      "Must swap a positive amount of tokens"
    );
  });

 it("should revert swap if token not supported", async () => {
  const Token = await hardhatEthers.getContractFactory("MockToken");
  const fakeToken = await Token.deploy("Fake", "FAKE", 18, parseEther("1000"));
  await fakeToken.waitForDeployment();

  // user get fakes tokens and approves the swap contract
  await fakeToken.transfer(user, parseEther("10"));
  await fakeToken.connect(user).approve(swap.target, parseEther("10"));

  // try to swap fake token for tokenB ( should revert )
  await expect(
    swap.connect(user).swap(fakeToken.target, tokenB.target, parseEther("10"))
  ).to.be.revertedWith("This token is not supported");
});

  it("should revert addLiquidity if not owner", async () => {
    const userSwap = swap.connect(user);
    await expect(
      userSwap.addLiquidity(tokenA.target, parseEther("1"))
    ).to.be.revertedWith("Not the owner");
  });
});
