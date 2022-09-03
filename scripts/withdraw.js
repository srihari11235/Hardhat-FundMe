const { getNamedAccounts, ethers } = require("hardhat")

//run below script to add funds to deployed contract.
async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    console.log("Withdrawing contract..")
    const transactionResponse = await fundMe.withdraw({ 
        gasLimit: 2000000
    });

    await transactionResponse.wait(1);
    console.log("withdrawn");

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })