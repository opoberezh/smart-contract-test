// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSale is Ownable {
    using SafeMath for uint256;

    IERC20 private _token; //address of the token for sale
    IERC20 private _usdt; //address of the stablecoin for payments
    uint256 private _rate; //number of tokens per unit of stablecoin
    uint256 private _cap;//max amount of stablecoins for this contract (summ of contract)
    uint256 private _weiRaised;//amount of stablecoins raised
    uint256 private _endTime;//end of sale
    bool private _paused;//flag indicating if the sale is paused

    mapping(address => uint256) private _purchasedTokens;//the amount of tokens purchased by each buyer

    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    constructor(
        address tokenAddress,
        uint256 saleRate,
        uint256 saleCap,
        uint256 duration,
        address initialOwner,
        address usdtAddress
    ) Ownable(initialOwner) {
        require(tokenAddress != address(0), "TokenSale: token address is the zero address");
        require(saleRate > 0, "TokenSale: rate is 0");
        require(saleCap > 0, "TokenSale: cap is 0");

        _token = IERC20(tokenAddress);
        _rate = saleRate;
        _cap = saleCap;
        _endTime = block.timestamp.add(duration);
        _paused = false;
        _usdt = IERC20(usdtAddress);
    } //this is initialization of sevral variables and checking that the provided parameters meet certain requirements


//buying tokens with stablecoins
    function buyTokens(address beneficiary, uint256 usdtAmount) external payable {
        require(!_paused, "TokenSale: sale is paused");
        require(beneficiary != address(0), "TokenSale: beneficiary is the zero address");
        require(usdtAmount > 0, "TokenSale: usdtAmount is 0");

        uint256 tokens = usdtAmount.mul(_rate);// number of tokens to be purchased

        require(_purchasedTokens[beneficiary].add(tokens) <= 50000 ether, "TokenSale: exceeding maximum purchase amount");
        require(_weiRaised.add(usdtAmount) <= _cap, "TokenSale: cap exceeded");

        _weiRaised = _weiRaised.add(usdtAmount);
        _purchasedTokens[beneficiary] = _purchasedTokens[beneficiary].add(tokens);//update the amount of tokens purchase by the buyer

        emit TokensPurchased(msg.sender, beneficiary, usdtAmount, tokens);//info about buyer: who, number of tokens purchased, amount of tokens

        require(_usdt.transferFrom(msg.sender, address(this), usdtAmount), "TokenSale: USDT transfer failed");// Transfer stablecoins to the contract
        require(_token.transfer(beneficiary, tokens), "TokenSale: token transfer failed");// Transfer tokens to the buyer
    }

// to get the token amount buyer will receive for provided USDT
    function _getTokenAmount(uint256 usdtAmount) private view returns (uint256) {
    return usdtAmount.mul(_rate);
}

//to pause the token sale
    function pauseSale() external onlyOwner {
        _paused = true;
    }

//to resume the token sale
    function resumeSale() external onlyOwner {
        _paused = false;
    }

//to withdraw tokens from the contract
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "TokenSale: withdrawal amount is 0");
        _token.transfer(owner(), amount);
    }

//to set a new token sale rate
    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "TokenSale: rate is 0");
        _rate = newRate;
    }

//to set a new token sale cap
    function setCap(uint256 newCap) external onlyOwner {
        require(newCap > 0, "TokenSale: cap is 0");
        _cap = newCap;
    }

// to set a new endTime
    function setEndTime(uint256 newEndTime) external onlyOwner {
        require(newEndTime > block.timestamp, "TokenSale: end time must be in the future");
        _endTime = newEndTime;
    }


//tj get the token address
    function token() external view returns (IERC20) {
        return _token;
    }

//to get the current token sale rate
    function rate() external view returns (uint256) {
        return _rate;
    }


//to get the current token sale cap
    function cap() external view returns (uint256) {
        return _cap;
    }

//to get the current endTime of sale
    function endTime() external view returns (uint256) {
        return _endTime;
    }

//to get the total amount of stablecoins raised
    function weiRaised() external view returns (uint256) {
        return _weiRaised;
    }

//to check if the token sale is paused
    function paused() external view returns (bool) {
        return _paused;
    }


//to get the amount of tokens purchased by a buyer
    function purchasedTokens(address beneficiary) external view returns (uint256) {
        return _purchasedTokens[beneficiary];
    }
}
