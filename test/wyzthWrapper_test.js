const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const provider = waffle.provider;

describe("CToken", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployState() {
        // Contracts are deployed using the first signer/account by default
        const [deployer, otherAccount] = await ethers.getSigners();
        //deploy factory 
        const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
        const pancakeFactory = await PancakeFactory.deploy(deployer.address);
        //deploy wwyzth
        const WWYZTH = await ethers.getContractFactory("WWYZTH");
        const wwyzth = await WWYZTH.deploy();
        //deploy router
        const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
        const pancakeRouter = await PancakeRouter.deploy(pancakeFactory.address, wwyzth.address);
        //deploy wrapper USDT
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const wrapperUSDT = await MockERC20.deploy("1000000000000000000000000");
        //Add liquidity in router
        //approve
        await wrapperUSDT.approve(pancakeRouter.address, "10000000000000000000000")
        pancakeRouter.addLiquidityETH(wrapperUSDT.address, "100000000000000000000", "5000000000000000000", 1, deployer.address, await time.latest() + 36000, { value: "50000000000000000000" });
        //deploy wyzthwrapper
        const Wrapper = await ethers.getContractFactory("WYZTHWrapper");
        const wrapper = await Wrapper.deploy(pancakeRouter.address, wrapperUSDT.address);
        const pair = await pancakeFactory.getPair(wwyzth.address, wrapperUSDT.address)

        // deploy USDT
        const MockERC20USDT = await ethers.getContractFactory("MockERC20");
        const USDT = await MockERC20USDT.deploy("1000000000000000000000000");

        await wrapperUSDT.approve(pancakeRouter.address, "10000000000000000000000")
        await USDT.approve(pancakeRouter.address, "5000000000000000000");
        await pancakeRouter.addLiquidity(wrapperUSDT.address, USDT.address, "100000000000000000000", "5000000000000000000", 1,1, deployer.address, await time.latest() + 36000);

        //deploy ethwrapper
        const EthWrapper = await ethers.getContractFactory("ETHWrapper");
        const ethwrapper = await EthWrapper.deploy(pancakeRouter.address, wrapperUSDT.address, USDT.address);

        return { pancakeRouter, pancakeFactory, wrapper, wrapperUSDT, USDT, wwyzth, deployer, pair, ethwrapper };
    }

    describe("WYZTH Wrapper calls", function () {
        it("Should deposit wyzth, swap and get USDT", async function () {
            const { wrapper, wrapperUSDT, wwyzth, deployer, pair} = await loadFixture(
                deployState
            );
            let amountToDeposit = "10000000000000000000"; //10 wyzth
            await wrapper.depositWyzth(deployer.address, { value: amountToDeposit });
            console.log(await wrapperUSDT.balanceOf(wrapper.address));
            console.log(await wwyzth.balanceOf(wrapper.address));
        });
        it("Should deposit USDT, swap and get Wyzth", async function () {
            const { wrapper, wrapperUSDT, wwyzth, deployer, pair} = await loadFixture(
                deployState
            );
            let amountToWithdraw = "10000000000000000000"; // 10 USDT
            await wrapper.depositWyzth(deployer.address, { value: amountToWithdraw }); //amountToWithdraw same as deposit
            console.log(await ethers.provider.getBalance(deployer.address));
            await wrapper.withdrawWyzth(amountToWithdraw, deployer.address);
            console.log(await wrapperUSDT.balanceOf(wrapper.address));
            console.log(await ethers.provider.getBalance(deployer.address));
        });
    })
    describe("ETH Wrapper calls", function () {
        it("Should deposit wyzth, swap and get USDT", async function () {
            const { ethwrapper, wrapperUSDT, wwyzth, deployer, pair, USDT} = await loadFixture(
                deployState
            );
            let amountToDeposit = "10000000000000000000"; //10 wyzth
            await USDT.approve(ethwrapper.address, "1000000");
            
            await ethwrapper.depositUSDT("1000000", deployer.address)
            console.log(await wrapperUSDT.balanceOf(ethwrapper.address));
            console.log(await wwyzth.balanceOf(ethwrapper.address));
        });
        it("Should deposit USDT, swap and get Wyzth", async function () {
            const { ethwrapper, wrapper, wrapperUSDT, wwyzth, deployer, pair, USDT} = await loadFixture(
                deployState
            );
            let amountToWithdraw = "1000000"; // 10 USDT
            await USDT.approve(ethwrapper.address, "1000000");
            await ethwrapper.depositUSDT("1000000", deployer.address) //amountToWithdraw same as deposit
            console.log(await ethers.provider.getBalance(deployer.address));
            // await ethwrapper.withdrawUSDT(amountToWithdraw, deployer.address);
            await wrapper.withdrawWyzth("100000000000000", deployer.address)
            console.log(await wrapperUSDT.balanceOf(ethwrapper.address));
            console.log(await ethers.provider.getBalance(deployer.address));
        });
    })
});