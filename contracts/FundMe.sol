//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./PriceConverter.sol";

//use below to use console.log() in the contract for debugging
import "hardhat/console.sol";

//use instead of revert (which stores string for err msg), reduces GAS. 
//error code
error FundMe_NotOwner();

/** @title A Contract for crowdfunding.
 * @author Srihari Haridasan
 * @notice This is a demo created as part of following te freecodecamp tutorial by Patrik Collins
 * @dev This implements price feeds from Chianlink as out library
 */
contract FundMe {
    //similar to extenstion in  c#, used as a library
    using PriceConvertor for uint256;

    //State vairables [below variables are called state variables. Marks the state of the contract]
    //s_ is appended to ntofiy that it is stored in storage and uses a lot of gas to store.
    //set to private => value accessed from getter methods. [use private for long term gas optimization and provider better API's for readability]
    address[] private s_funders; 
    //set to private => value accessed from getter methods
    mapping(address => uint256) private s_addressToAmountFunded;

    //constant, immutable keywords [GAS optimization]
    // using constant keyword makes the variable not to take the storage slot
    // instead of storing in storage slot they are stored in byte code of the contract thuis improving the gas used. 
    uint256 public constant MINIMUM_USD = 1 * 1e18;

    //similar to readonly in c#
    //used when it needs to be set only once
    //set to private => value accessed from getter methods
    address private immutable i_owner;
    
    AggregatorV3Interface public s_priceFeed;
    
    //modifier can be used with functions to run this first/last. 
    //'_' tells  the calling function when to run this modifier. 
    //If _ is at the after the code, the code will be executed at first.
    //If _ is before the code, the code will be executed at last.
    modifier onlyOwner {
        // require(msg.sender == i_owner, "Not the owner");
        // _; //execute calling function after above code is run

        //use custom error instead of require for GAS optimization.
        if(msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    //call just after deployment of the contract.
    constructor(address priceFeedAddress) {
        //the FIRST sender is the one who deploys the contract. 
        i_owner = msg.sender; 
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);

    }    

    //What happens when someone sends this contract ETH without calling fund function. (Contract is still an address/account in the chain.)
    //Solidity Special Functions. 

    //1. Receive 
    //2. fallback

    //Is called when we send money directly to the contract, as long as there is no data as part of the transaction.
    //method will automatically get triggered anytime a transaction happens. This will not be called when data is provided as part of transaction. 
    receive() external payable {
        fund();
    }

    //fallback will be called when the transaction has DATA as part of the transcation. 
    fallback() external payable {
        fund();
    }

    /**
     * @notice This function is used to fund this contract
     */
    //payable keyword marks the function to read from value. 
    //payable is used to send native token to the contract (contract is initself an address/account in the blockchain). 
    function fund() public payable {
        //require if like a condition that needs to me met for the operation to succeed. 
        //if the condition fails, the transaction is canceled i.e is reverted.         
        //getConversionRate() acts as extension method in c# (method defined in file PriceConvertor.sol). method should have first parameter uint256 (as mentioned in using)        
        //value is passed to the getConversionRate() method.
        //GAS Optimization: remove require and use custom error codes. require uses array for strings => costlier gas.
        require(msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD, "Didnt send enough");
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {    
        for(uint256 funderIndex=0; funderIndex < s_funders.length; funderIndex++) {
            address funder = s_funders[funderIndex];

            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);

        //Different type of fund transfer methods: 
        //-----------//
        //[uncomment below]transfer - is capped at 2300 gas. Function will throw error if transaction exceeds gas
        // payable(msg.sender).transfer(address(this).balance);

        //[uncomment below two lines]send - is capped at 2300 gas. Function will return bool to indicate success.
        // bool sendSuccess =  payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send Failed");

        //call
        (bool callSuccess, /* bytes memory dataReturned */ ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call Failed");
    }

    function cheaper_withdraw() public onlyOwner {

        //setting to a local variable to avoid multiple reads from storage, 
        //Instead reading from local variable from memory.
        address[] memory funders = s_funders;

        for(uint256 funderIndex=0; funderIndex < funders.length; funderIndex++)    {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);
         //call
        (bool callSuccess, /* bytes memory dataReturned */ ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "call Failed");
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address){
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder) public view returns (uint256) {
        return s_addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}