// We import Chai to use its asserting functions here.
const { ethers } = require("hardhat");

async function main() {

    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts : ", accounts[0]);

    const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
    const pancakeFactory = await PancakeFactory.deploy(accounts[0]);
    await pancakeFactory.deployed();
    console.log("Factory", pancakeFactory.address);

    //deploy wwyzth
    const WWYZTH = await ethers.getContractFactory("WWYZTH");
    const wwyzth = await WWYZTH.deploy();
    await wwyzth.deployed();
    console.log("WWyth", wwyzth.address);

    //deploy router
    const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
    const pancakeRouter = await PancakeRouter.deploy(pancakeFactory.address, wwyzth.address);
    await pancakeRouter.deployed();
    console.log("Router", pancakeRouter.address);

    // deploy USDT
    const MockERC20USDT = await ethers.getContractFactory("MockERC20");
    const USDT = await MockERC20USDT.deploy("1000000000000000000000000");
    await USDT.deployed();
    console.log("USDT", USDT.address);

    //deploy wrapper USDT
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const wrapperUSDT = await MockERC20.deploy("1000000000000000000000000");
    await wrapperUSDT.deployed();
    console.log("Wrapper USDT", wrapperUSDT.address);

    //Add liquidity in router
    //approve
    await wrapperUSDT.approve(pancakeRouter.address, "10000000000000000000000")
    await pancakeRouter.addLiquidity(wrapperUSDT.address, USDT.address, "100000000000000000000", "5000000000000000000", 1,1, accounts[0], 1673352794 + 36000);
    //deploy wyzthwrapper
    const Wrapper = await ethers.getContractFactory("ETHWrapper");
    const wrapper = await Wrapper.deploy(pancakeRouter.address, wrapperUSDT.address, USDT.address);
    await wrapper.deployed();
    console.log("ethWrapper", wrapper.address);
    const pair = await pancakeFactory.getPair(wwyzth.address, wrapperUSDT.address);
    console.log("pair Address", pair);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })