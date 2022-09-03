const { run } = require("hardhat");

async function verify(contractAddress, args) {  
    console.log("Verifying Contract..");
    try {
      // run command is used to run --verify on hardhat. The block explorer (etherscan) details has been setup in hardhat.config.js
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      }); 
    } catch(e) {
      if(e.message.toLowerCase().includes("already verified")) {
        console.log("Already Verified");
      } else {
        console.log(e);
      }
    }
}

module.exports = {
    verify
}