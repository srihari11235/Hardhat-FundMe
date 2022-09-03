//name of file: Is numbered and hardhat will pick up the file in the order of the numbers. 
//The hardhat deploy will look in the /deploy folder for deployment scripts

const { getNamedAccounts, deployments, network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
require("dotenv").config();
const { verify } = require("../utils/verify");

//there is no need for main function.

//Approach 1: 
// function deployFunc() {

// }

// //export function and tells hardhat to call this function for deployment 
// module.exports.default = deployFunc();

//Approach 2: 

//this is a nameless async function => anonymous function. 
//the syntax is identical to approach 1. 
//hre - harthat runtime environment
//retrieve functions from hre (getNamedAccounts & deployments)
// module.exports = async (hre) => {
//     hre.getNamedAccounts
//     hre.deployments
// }
//this is similar to the above syntax
module.exports = async ({ getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    //named accounts defined in hardhat.config.js
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId;

    let ethUsdPriceFeed = '';

    if(developmentChains.includes(network.name)){
        log("Deploy Target : Local Network");
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeed = ethUsdAggregator.address;
    } else  {
        log("Deploy Target : Live Hosted Network");
        ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    //when going for local network or hardhat network we have to use a mock - to get exteranl data feeds. 
    //External data feeds are obtained using addresses [check PriceConverter.js] 
    const args = [ethUsdPriceFeed]

    log("deploying..");
    const fundMe = await deploy("FundMe", {
        from: deployer,
        //Providing data here will construct the contract with the data as constructor arguments.        
        args: args, // price feed address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    });

    log("Deployed!");
    log("------------------------------------------");

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_APIKEY){    
        //verify code added in utils/verify.js
        await verify(fundMe.address, args);
    }
}

//By specifying tags you can run specific deploy scripts by sing --tags fundme in cmd command.
module.exports.tags = ["all", "fundme"];