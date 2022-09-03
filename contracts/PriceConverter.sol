//SPDX-License-Identifier: MIT
pragma solidity  ^0.8.7;

//importing from npm repository
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {

    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        //ABI - is an to an interface. ABI has the details of the public functions, properties that can be used. 
        //ABI - Compiling an interface gives an ABI. With the details of the interfaces. 
        //address :  	0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

        //This address is obtained from chainlink (a data feed provider) for ETH / USD. 
        //dynamic priceFeed initialization based on dpeloyed chain. Initialized in FundMe.sol
        (,int256 price,,,) = priceFeed.latestRoundData();

        return uint256(price * 1e10); 
    }


    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns (uint256) {

        uint256 ethPrice = getPrice(priceFeed); 
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        return ethAmountInUsd;
    }
}