// We import Chai to use its asserting functions here.
const { ethers } = require("hardhat");

async function main() {

    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts : ", accounts[0]);

    const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
    // const pancakeFactory = await PancakeFactory.deploy(accounts[0]);
    const pancakeFactory = await PancakeFactory.attach("0xCe58d602CBd3b96b5e126336Ba71d9A4803C82D6")
    await pancakeFactory.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("Factory", pancakeFactory.address);

    //deploy wwyzth
    const WWYZTH = await ethers.getContractFactory("WWYZTH");
    // const wwyzth = await WWYZTH.deploy();
    const wwyzth = await WWYZTH.attach("0xA05849d5864E5EA01A43496DF828a9Adb816D9b1")
    await wwyzth.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("WWyth", wwyzth.address);

    //deploy router
    const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
    // const pancakeRouter = await PancakeRouter.deploy(pancakeFactory.address, wwyzth.address);
    const pancakeRouter = await PancakeRouter.attach("0xb92a84B97c2fd83F2aA8B5d7C0dB28adE5ed4822")
    await pancakeRouter.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("Router", pancakeRouter.address);

    // deploy USDT
    const MockERC20USDT = await ethers.getContractFactory("MockERC20");
    // const USDT = await MockERC20USDT.deploy("1000000000000000000000000");
    const USDT = await MockERC20USDT.attach("0x5265B7Fa0B4987f732f2cEf8129BA5261a7e33D7")
    await USDT.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("USDT", USDT.address);

    //deploy wrapper USDT
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    // const wrapperUSDT = await MockERC20.deploy("1000000000000000000000000");
    const wrapperUSDT = await MockERC20.attach("0x1F4Ff6FA6584D357bE582DA6810C033497228bC2")
    await wrapperUSDT.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("Wrapper USDT", wrapperUSDT.address);

    //Add liquidity in router
    //approve
    // await wrapperUSDT.approve(pancakeRouter.address, "10000000000000000000000")
    // await new Promise(res => setTimeout(res, 15000));
    // await USDT.approve(pancakeRouter.address, "5000000000000000000");
    // await new Promise(res => setTimeout(res, 15000));
    // await pancakeRouter.addLiquidity(wrapperUSDT.address, USDT.address, "100000000000000000000", "5000000000000000000", 1,1, accounts[0], 1673437858 + 36000);
    // await new Promise(res => setTimeout(res, 15000));
    // //deploy wyzthwrapper
    const Wrapper = await ethers.getContractFactory("ETHWrapper");
    const wrapper = await Wrapper.deploy(pancakeRouter.address, wrapperUSDT.address, USDT.address);
    await wrapper.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("ethWrapper", wrapper.address);
    const pair = await pancakeFactory.getPair(USDT.address, wrapperUSDT.address);
    await new Promise(res => setTimeout(res, 15000));
    console.log("pair Address", pair);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })