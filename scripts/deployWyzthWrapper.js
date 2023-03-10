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

    //deploy wrapper USDT
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const wrapperUSDT = await MockERC20.deploy("1000000000000000000000000");
    await wrapperUSDT.deployed();
    console.log("Wrapper USDT", wrapperUSDT.address);

    //Add liquidity in router
    //approve
    await wrapperUSDT.approve(pancakeRouter.address, "10000000000000000000000");
    await new Promise(res => setTimeout(res, 15000));
    await pancakeRouter.addLiquidityETH(wrapperUSDT.address, "10000000000000000000", "5000000000000000000", 1, accounts[0], 1673354932 + 36000, { value: "5000000000000000000" });
    // //deploy wyzthwrapper
    const Wrapper = await ethers.getContractFactory("WYZTHWrapper");
    const wrapper = await Wrapper.deploy(pancakeRouter.address, wrapperUSDT.address);
    await wrapper.deployed();
    console.log("ethWrapper", wrapper.address);
    const pair = await pancakeFactory.getPair(wwyzth.address, wrapperUSDT.address)
    console.log("pair Address", pair);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })