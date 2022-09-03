require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers")
require("dotenv").config();
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */

const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";

module.exports = {
  // solidity: "0.8.7",
  //add multiple solidity version if contrracts use multiple versions
  solidity: {
    compilers: [
      {
        version: "0.8.7"
      }, 
      {
        version: "0.6.6"
      }]
  },
  defaultNetwork: "hardhat",
  namedAccounts:{
    deployer: {
      default: 0
    }
  },
  networks: {
    //connect to testnet by configuring the RPC url and providing private key of account with which we can connect.
    //command to specify network 'npx hardhat deploy --network <name>'
    rinkeby: {      
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 6      
    },     
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6   
    },
    //run command - 'npx hardhat node' to set up local node, similar to ganache setup
    //local hardhat setup automatically takes random existing account details. 
    localhost: {
      url: 'http://127.0.0.1:8545/',
      chainId: 31337      
    }
  },
  //API key is generated after login in to etherscan and is for a single account.
  //Used for verification process to show contract code in etherscan.
  etherscan: {
    apiKey: ETHERSCAN_APIKEY
  },
   //get report on how much gas used in terminal or in a file. utilised when running a tests.
   gasReporter: {
    enabled: true,
    //generate report to a file
    outputFile: "gas-report.txt",
    noColors: true    
    //optional- to get report in USD from live exchange rate, generate apikey from coinmarketcap website
    // curreny: "USD"
    // coinmarketcap: COINMARKETCAP_APIKEY
    //add which blockchain to deploy to, buy specifing here. 
    //token: "MATIC"
  }
};
