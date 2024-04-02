// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract TokenSale is Ownable {
    using SafeMath for uint256;

    IERC20 private _token;
    IERC20 private _usdt;
    address private _wallet;
    uint256 private _rate;
    uint256 private _cap;
    uint256 private _weiRaised;
    uint256 private _endTime;
    bool private _paused;

    mapping(address => uint256) private _purchasedTokens;

    event TokensPurchased(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    constructor(
        address tokenAddress,
        address walletAddress,
        uint256 saleRate,
        uint256 saleCap,
        uint256 duration,
        address initialOwner,
        address usdtAddress
    ) Ownable(initialOwner) {
        require(tokenAddress != address(0), "TokenSale: token address is the zero address");
        require(walletAddress != address(0), "TokenSale: wallet is the zero address");
        require(saleRate > 0, "TokenSale: rate is 0");
        require(saleCap > 0, "TokenSale: cap is 0");

        _token = IERC20(tokenAddress);
        _wallet = walletAddress;
        _rate = saleRate;
        _cap = saleCap;
        _endTime = block.timestamp.add(duration);
        _paused = false;
        _usdt = IERC20(usdtAddress);
    }

    function buyTokens(address beneficiary, uint256 usdtAmount) external payable {
        require(!_paused, "TokenSale: sale is paused");
        require(beneficiary != address(0), "TokenSale: beneficiary is the zero address");
        require(usdtAmount > 0, "TokenSale: usdtAmount is 0");

        uint256 tokens = usdtAmount.mul(_rate);

        require(msg.value > 0, "TokenSale: weiAmount is 0");
       

        require(_purchasedTokens[beneficiary].add(tokens) <= 50000 ether, "TokenSale: exceeding maximum purchase amount");
        require(_weiRaised.add(usdtAmount) <= _cap, "TokenSale: cap exceeded");

        _weiRaised = _weiRaised.add(usdtAmount);
        _purchasedTokens[beneficiary] = _purchasedTokens[beneficiary].add(tokens);

        emit TokensPurchased(msg.sender, beneficiary, usdtAmount, tokens);

       require(_usdt.transferFrom(msg.sender, _wallet, usdtAmount), "TokenSale: USDT transfer failed");

      
    }

    function _getTokenAmount(uint256 weiAmount) private view returns (uint256) {
        return weiAmount.mul(_rate);
    }


    function pauseSale() external onlyOwner {
        _paused = true;
    }

    function resumeSale() external onlyOwner {
        _paused = false;
    }

    function withdrawTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "TokenSale: withdrawal amount is 0");
        _token.transfer(owner(), amount);
    }

    function setRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "TokenSale: rate is 0");
        _rate = newRate;
    }

    function setCap(uint256 newCap) external onlyOwner {
        require(newCap > 0, "TokenSale: cap is 0");
        _cap = newCap;
    }

    function setEndTime(uint256 newEndTime) external onlyOwner {
        require(newEndTime > block.timestamp, "TokenSale: end time must be in the future");
        _endTime = newEndTime;
    }

    function token() external view returns (IERC20) {
        return _token;
    }

    function wallet() external view returns (address) {
        return _wallet;
    }

    function rate() external view returns (uint256) {
        return _rate;
    }

    function cap() external view returns (uint256) {
        return _cap;
    }

    function endTime() external view returns (uint256) {
        return _endTime;
    }

    function weiRaised() external view returns (uint256) {
        return _weiRaised;
    }

    function paused() external view returns (bool) {
        return _paused;
    }

    function purchasedTokens(address beneficiary) external view returns (uint256) {
        return _purchasedTokens[beneficiary];
    }
}
