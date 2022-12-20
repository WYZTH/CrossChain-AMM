// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
// const { ethers } = require("hardhat")

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");
  const accounts = await hre.ethers.provider.listAccounts();
  console.log("Accounts", accounts[0]);
  
  const marginContract = "0x5608A2052DaeE157F2D1778C5E2F64a56e1280c6";
  const marginFundsContract = "0xDA58bDC4d9156880fd84BB9F8c00Cce76d2870dC";
  const positionContract = "0x6d2bB2B69FB9a941042C4b64ACcB79cd62Ee88eb";

  const liquidationReserves = "0xcE921F43569f56E7c67534b3c9bB0c4cbcD5a0e6";
  const protocolReserves = "0xc0E487EC884613Ca543C74Eb518b1A8ce637faB7";

  //usdcDelegatorAddress
  const USDC = "0x5D61549Df3eD548227F797208A0aE01453b4666d";
  const CUsdc = "0xE4211455491B18a4Be8b1974f430e6680A5AAB1B";

  //CMaticDelegatorAddress
  const CMatic = "0x1E83566e844472A5371F5b77261Ea03CaD095198";

  //CEthDelegatorAddress
  const Eth = "0x221217880C631def34Ce3232Ae4321a45A7D6F21";
  const CEth = "0xDbC00F8837ecA0dc5d3DC1e74fb9a37961a74093";

  const admin = await hre.ethers.getContractFactory("AdminFunctions");
  const adminContract = await upgrades.deployProxy(admin, { intializer: 'initialize' });
  //await adminContract.deployed();
  console.log("Admin Proxy", adminContract.address);

//   await adminContract.updateSupplyApy(5);

//   await adminContract.updateSupplyAPYIncentives(5);

//   await adminContract.updateBaseBorrowRate(5);

//   await adminContract.updateProtocolMargin(5);

//   await adminContract.updateAMMs(5);

  await adminContract.updateBaseLTM(4);

  await adminContract.updateMarginReservePercent(5);

  await adminContract.updateLiquidationRatio(80);

  await adminContract.updateMarginCallRatio(70);

  await adminContract.updateProtocolFees(20);

  await adminContract.updateLiquidationPenalty(2);

  await adminContract.updateMargin(marginContract);

  await adminContract.updateMarginFunds(marginFundsContract);

  await adminContract.updatePosition(positionContract);

  await adminContract.updateLiquidationReserves(liquidationReserves);

  await adminContract.updateProtocolReserves(protocolReserves);

  await adminContract.addDelegatorAddress(USDC, CUsdc);

  await adminContract.addDelegatorAddress("0x0000000000000000000000000000000000000000", CMatic);

  await adminContract.addDelegatorAddress(Eth, CEth);

  //----------------------------------------------

//   await adminContract.updateSlippageTolerance(5);

//   await adminContract.updateInterestMarginCall(5);

//   await adminContract.updateInterestLiquidation(5);

  // await adminContract.updateTreasuryContract(treasuryContract);

  // await adminContract.updateApproveAssetStatus(assetAddress, true);


  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
