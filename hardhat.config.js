require("@nomiclabs/hardhat-waffle");
require('@openzeppelin/hardhat-upgrades')
require("@nomiclabs/hardhat-etherscan");
// require('hardhat-contract-sizer');
require("dotenv").config()

// require('@primitivefi/hardhat-dodoc');


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const GOERLI_PRIVATE_KEY = "776fd0384f8c240a5e31e5cc180a11eefc4a9a30c07178af638f337c471db471";
const GOERLI_URL = "https://eth-goerli.g.alchemy.com/v2/rSGKT3t6OhdxVgF7m09ObpVD88ehLLyQ"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    local: {
      url: 'http://127.0.0.1:8545/'
    },
    goerli: {
      url: GOERLI_URL,
      accounts: [GOERLI_PRIVATE_KEY]
    },
    wyzthtestnet: {
      url: 'http://13.127.52.76:8545',
      accounts: [GOERLI_PRIVATE_KEY]
    }

  },
  etherscan: {
    // apiKey: "F3HN9IGWSZ5NYWEJBEM4Q214H2Q1BESN67"
  },
  solidity: {
    // version:  "0.7.6",
    compilers: [
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          }
        },
      }
    ],
  }
}
