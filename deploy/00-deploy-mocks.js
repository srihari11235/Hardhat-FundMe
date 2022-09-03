//name of file: 00- number used to denote pre-deployment script.
const { network } = require("hardhat");
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");




module.exports = async ({ getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    //named accounts defined in hardhat.config.js
    const { deployer } = await getNamedAccounts()

    //define the chain names in helper-config.
    if(developmentChains.includes(network.name)){
        log("Local network detected! Deploying mocks..");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            //add arguments of the interface constructor. Check github implementation for get constructor arguments
            args: [DECIMALS, INITIAL_ANSWER],
            log: true

        })
        log("Mocks Deployed");
        log("---------------------------------------------");
    }
}

//By specifying tags you can run specific deploy scripts by sing --tags fundme in cmd command.
module.exports.tags = ["all", "mocks"];