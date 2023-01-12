// We import Chai to use its asserting functions here.
const { ethers } = require("hardhat");

async function main() {

    const accounts = await ethers.provider.listAccounts();
    console.log("Accounts : ", accounts[0]);

    const Wrapper = await ethers.getContractFactory("WYZTHWrapper");
    const wrapper = Wrapper.attach("0xeD42b57A78469E04EC3217c66183F4761C0d98Ff");
    await wrapper.withdrawWyzth("2000000000000000", "0xd8A47C69B7d5F939BeB6FADD62183c1dB40836b6")

}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })