const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

//Note: run specific test by using this command 'npx hardhat test --grep "<substring of string provided in it()>"'
//example 'npx hardhat test --grep "amount funded"'
!developmentChains.includes(network.name) ? describe.skip :
describe("FundMe", async function () {

    let fundMe;
    let deployer;
    const sendValue = ethers.utils.parseEther("10"); // 1 eth
    this.beforeEach(async function () {

        // //this can be used to get the accounts directly that are defined in the hardhat.config.js under networks. 
        //under defaultNetwork we will get 10 accounts created by hardhat.
        // const accounts = await ethers.getSigner();
        // //we can retrieve account information like below
        // const accountZero = accounts[0];

        deployer = (await getNamedAccounts()).deployer;
        //with fixture we can deploy specific deploy scripts based on the tags defined. 
        //'all' tag is defined in both the deployment files. Fixture looks for deployment files in /deploy folder.
        // this will run the deploy script in local network. 
        await deployments.fixture(["all"]);
        //this will return the most recently deployed contract.
        //the retrieved contract will be from the specified 'deployer' account.
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    });

    describe("constructor", async function () {
        it("sets the aggregator address directly", async function () {
            const response = await fundMe.getPriceFeed();
            assert.equal(response, mockV3Aggregator.address);
        })

        it("sets the i_owner with contract address", async function () {
            const actual_i_owner = await fundMe.getOwner(); 
            // const expected_i_owner = await fundMe.provider;
            assert.equal(actual_i_owner, deployer);
        })
    });

    describe("Receive special function auto calls fund()", async function () {
        it("set new fund recieved & funder address", async function () {
            const [ owner, add1 ] = await ethers.getSigners();
                        
            const signer = await ethers.getSignerOrNull(add1.address)

            const tx = await signer.sendTransaction({
                to: fundMe.address,
                value: ethers.utils.parseEther("100"),
                gasPrice: 779345514,
                gasLimit: 300000
            });
            
            const funder = await fundMe.getFunder(0);
            const amount = await fundMe.getAddressToAmountFunded(add1.address);
            
            assert.equal(funder, add1.address);
            assert.equal(amount, ethers.utils.parseEther("100").toString());
        });
    })

    describe("fallBack special function auto calls fund", async function () {
        it("set new fund recieved & funder address", async function () {
            const [ owner, add1 ] = await ethers.getSigners();
            
            const signer = await ethers.getSignerOrNull(add1.address)

            //sending data in tx invokes fallBack method
            const tx = await signer.sendTransaction({
                to: fundMe.address,
                value: ethers.utils.parseEther("100"),
                gasPrice: 779345514,
                gasLimit: 300000,
                data: "0x60806040526040518060400160405280600281526020016040518060400160405280600781526020017f5372696861726900000000000000000000000000000000000000000000000000815250815250600160008201518160000155602082015181600101908051906020019061007792919061008c565b50505034801561008657600080fd5b50610190565b8280546100989061012f565b90600052602060002090601f0160209004810192826100ba5760008555610101565b82601f106100d357805160ff1916838001178555610101565b82800160010185558215610101579182015b828111156101005782518255916020019190600101906100e5565b5b50905061010e9190610112565b5090565b5b8082111561012b576000816000905550600101610113565b5090565b6000600282049050600182168061014757607f821691505b6020821081141561015b5761015a610161565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6108838061019f6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c80636f760f411161005b5780636f760f41146100da57806377ec2b55146100f65780638bab8dd5146101155780639e7a13ad146101455761007d565b80632e64cec114610082578063471f7cdf146100a05780636057361d146100be575b600080fd5b61008a610176565b604051610097919061063c565b60405180910390f35b6100a861017f565b6040516100b5919061063c565b60405180910390f35b6100d860048036038101906100d3919061057f565b610185565b005b6100f460048036038101906100ef9190610523565b610198565b005b6100fe61022e565b60405161010c929190610657565b60405180910390f35b61012f600480360381019061012a91906104da565b6102c8565b60405161013c919061063c565b60405180910390f35b61015f600480360381019061015a919061057f565b6102f6565b60405161016d929190610657565b60405180910390f35b60008054905090565b60005481565b80600081905550610194610176565b5050565b6000604051806040016040528083815260200184815250905060038190806001815401808255809150506001900390600052602060002090600202016000909190919091506000820151816000015560208201518160010190805190602001906102039291906103b2565b505050816004846040516102179190610625565b908152602001604051809103902081905550505050565b600180600001549080600101805461024590610750565b80601f016020809104026020016040519081016040528092919081815260200182805461027190610750565b80156102be5780601f10610293576101008083540402835291602001916102be565b820191906000526020600020905b8154815290600101906020018083116102a157829003601f168201915b5050505050905082565b6004818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b6003818154811061030657600080fd5b906000526020600020906002020160009150905080600001549080600101805461032f90610750565b80601f016020809104026020016040519081016040528092919081815260200182805461035b90610750565b80156103a85780601f1061037d576101008083540402835291602001916103a8565b820191906000526020600020905b81548152906001019060200180831161038b57829003601f168201915b5050505050905082565b8280546103be90610750565b90600052602060002090601f0160209004810192826103e05760008555610427565b82601f106103f957805160ff1916838001178555610427565b82800160010185558215610427579182015b8281111561042657825182559160200191906001019061040b565b5b5090506104349190610438565b5090565b5b80821115610451576000816000905550600101610439565b5090565b6000610468610463846106ac565b610687565b90508281526020810184848401111561048457610483610816565b5b61048f84828561070e565b509392505050565b600082601f8301126104ac576104ab610811565b5b81356104bc848260208601610455565b91505092915050565b6000813590506104d481610836565b92915050565b6000602082840312156104f0576104ef610820565b5b600082013567ffffffffffffffff81111561050e5761050d61081b565b5b61051a84828501610497565b91505092915050565b6000806040838503121561053a57610539610820565b5b600083013567ffffffffffffffff8111156105585761055761081b565b5b61056485828601610497565b9250506020610575858286016104c5565b9150509250929050565b60006020828403121561059557610594610820565b5b60006105a3848285016104c5565b91505092915050565b60006105b7826106dd565b6105c181856106e8565b93506105d181856020860161071d565b6105da81610825565b840191505092915050565b60006105f0826106dd565b6105fa81856106f9565b935061060a81856020860161071d565b80840191505092915050565b61061f81610704565b82525050565b600061063182846105e5565b915081905092915050565b60006020820190506106516000830184610616565b92915050565b600060408201905061066c6000830185610616565b818103602083015261067e81846105ac565b90509392505050565b60006106916106a2565b905061069d8282610782565b919050565b6000604051905090565b600067ffffffffffffffff8211156106c7576106c66107e2565b5b6106d082610825565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561073b578082015181840152602081019050610720565b8381111561074a576000848401525b50505050565b6000600282049050600182168061076857607f821691505b6020821081141561077c5761077b6107b3565b5b50919050565b61078b82610825565b810181811067ffffffffffffffff821117156107aa576107a96107e2565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61083f81610704565b811461084a57600080fd5b5056fea26469706673582212207d1409714a9d08805a5b192f274d53edf34f52d40ac3daea5a75240d445f361a64736f6c63430008070033"
            });
            
            const funder = await fundMe.getFunder(0);
            const amount = await fundMe.getAddressToAmountFunded(add1.address);
            
            assert.equal(funder, add1.address);
            assert.equal(amount, ethers.utils.parseEther("100").toString());
        });
    })

    describe("fund", async function () {
        it("fails if you dont send enough eth", async function() {
            await expect(fundMe.fund()).to.be.revertedWith("Didnt send enough");
        });

        it("updates the amount funded data structure", async function() {
            await fundMe.fund({ value: sendValue});
            const response = await fundMe.getAddressToAmountFunded(deployer);

            assert.equal(response.toString(), sendValue.toString());
        })
        it("addes funder to funders array", async function () {
            await fundMe.fund({ value: sendValue});

            const funder = await fundMe.getFunder(0);

            assert.equal(funder, deployer);
        })

    })

    describe("withdraw", async function () {
        this.beforeEach(async function (){
            await fundMe.fund({value : sendValue});
        })

        it("withdraw ETH from a single funder", async  function (){

            //use provider to get balance of the address. We can also use ethers.provider.getBalance()
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);

            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const txReponse = await fundMe.withdraw();
            const txReceipt = await txReponse.wait(1);

            const endingFundMeBalace = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            assert.equal(endingFundMeBalace, 0);

            //withdraw functions removes funds from contract and sends to the onwer
            //owner = deployer => hence deployer ending balance should be equal to fundMeBalance + existing deployer balance
            //withdraw transaction will have a gas cost. Hence ending deployer balance will have gas cost reduced from it. 
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString() )
        })

        it("allows us to withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners();

            for(let i = 0; i < 6; i++) {
                //by default the fundMe is connected to the deployer [done in beforeEach on top]
                //use this to connect new account to fundMe. 
                const fundMeConnectedContract =  await fundMe.connect(accounts[i]);
                //the fund will be transffered from new connected account. 
                await fundMeConnectedContract.fund({ value: sendValue});
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);

            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const txReponse = await fundMe.withdraw();
            const txReceipt = await txReponse.wait(1);

            const endingFundMeBalace = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            assert.equal(endingFundMeBalace, 0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString() )

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for(let i = 0; i < 6; i++) {
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0);
            }
        })

        it("only allows the owner to withdrow", async function () {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnectedContract = await fundMe.connect(attacker);
            await expect(attackerConnectedContract.withdraw()).to.be.revertedWithCustomError(fundMe, "FundMe_NotOwner");
        })

        it("cheaper withdraw single", async  function (){

            //use provider to get balance of the address. We can also use ethers.provider.getBalance()
            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);

            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const txReponse = await fundMe.cheaper_withdraw();
            const txReceipt = await txReponse.wait(1);

            const endingFundMeBalace = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            assert.equal(endingFundMeBalace, 0);

            //withdraw functions removes funds from contract and sends to the onwer
            //owner = deployer => hence deployer ending balance should be equal to fundMeBalance + existing deployer balance
            //withdraw transaction will have a gas cost. Hence ending deployer balance will have gas cost reduced from it. 
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString() )
        })

        it("cheaper withdraw with multiple funders", async function () {
            const accounts = await ethers.getSigners();

            for(let i = 0; i < 6; i++) {
                //by default the fundMe is connected to the deployer [done in beforeEach on top]
                //use this to connect new account to fundMe. 
                const fundMeConnectedContract =  await fundMe.connect(accounts[i]);
                //the fund will be transffered from new connected account. 
                await fundMeConnectedContract.fund({ value: sendValue});
            }

            const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);

            const startingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const txReponse = await fundMe.cheaper_withdraw();
            const txReceipt = await txReponse.wait(1);

            const endingFundMeBalace = await fundMe.provider.getBalance(fundMe.address);
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice);

            assert.equal(endingFundMeBalace, 0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(), endingDeployerBalance.add(gasCost).toString() )

            await expect(fundMe.getFunder(0)).to.be.reverted;

            for(let i = 0; i < 6; i++) {
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].address), 0);
            }
        })
    })

});