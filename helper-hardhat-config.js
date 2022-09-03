const networkConfig = {
    4: {
        name: "rinkeby",
        ethUsdPriceFeed: "0x78F9e60608bF48a1155b4B2A5e31F32318a1d85F"
    }, 
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }, 
    5: {
        name: "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    }
}

const developmentChains = ["hardhat", "localhost"];

//Mock for AggregatorV3Interface used in local development.
const DECIMALS = 8;
const INITIAL_ANSWER = 20000000

module.exports = {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}