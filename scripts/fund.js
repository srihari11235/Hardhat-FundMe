const { getNamedAccounts, ethers } = require("hardhat")

//run below script to add funds to deployed contract.
async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("Funding contract..")
    const transactionResponse = await fundMe.fund({ 
        value : ethers.utils.parseEther("10"),
        gasLimit: 2000000
    });

    await transactionResponse.wait(1);
    console.log("Funded");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })