
const { getNamedAccounts, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert, expect } = require("chai");


developmentChains.includes(network.name) ? describe.skip :
describe("FundMe", async function () {
    
    let deployer; 
    let fundMe;
    let sendValue = ethers.utils.parseEther("0.01");
    this.beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
    })

    it("allow people to fund and withdraw", async function () {
        const txResponse = await fundMe.fund({ value: sendValue });
        const txReceipt = txResponse.wait(6);

        const nouce = txResponse.nonce;

        const txResponse_Withdraw  = await fundMe.withdraw({ nonce : nouce + 1, gasLimit: 2000000});
        const txReceipt_withdraw = txResponse_Withdraw.wait(12);

        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
    })
})