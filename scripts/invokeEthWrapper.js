// We import Chai to use its asserting functions here.
const { ethers } = require("hardhat");

async function main() {

    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts : ", accounts[0]);

    const Wrapper = await ethers.getContractFactory("ETHWrapper");
    const wrapper = await Wrapper.deploy("0xb92a84B97c2fd83F2aA8B5d7C0dB28adE5ed4822", "0x1F4Ff6FA6584D357bE582DA6810C033497228bC2", "0x5265B7Fa0B4987f732f2cEf8129BA5261a7e33D7");
    await wrapper.deployed();
    // await new Promise(res => setTimeout(res, 15000));
    console.log("ethWrapper", wrapper.address);

    // const MockERC20USDT = await ethers.getContractFactory("MockERC20");
    // const USDT = await MockERC20USDT.attach("0x5265B7Fa0B4987f732f2cEf8129BA5261a7e33D7")
    // // await USDT.approve(wrapper.address, "100000000000")
    // // await new Promise(res => setTimeout(res, 10000));
    // await wrapper.depositUSDT("1000000", "0xd8A47C69B7d5F939BeB6FADD62183c1dB40836b6")

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })