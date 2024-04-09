// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SolarGreenToken is ERC20, Ownable {
    mapping(address => bool) private _blacklist; //mapping to store the blacklist status for each address;

    constructor() ERC20("Solar Green", "SGR") Ownable(msg.sender) {
        uint256 initialSupply = 100000000 * (10 ** uint256(decimals()));
        _mint(msg.sender, initialSupply);
    }

    // Constructor function to initialize the Solar Green token with the specified initial supply.
    // It calls the constructor of the ERC20 base contract to set the name and symbol of the token,
    // and then mints the initial supply to the deployer's address.

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    function addToBlacklist(address account) external onlyOwner {
        _blacklist[account] = true;
    }

    function removeFromBlacklist(address account) external onlyOwner {
        _blacklist[account] = false;
    }

    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    } // Public function to check if a specified account is blacklisted. Retuns true or false.

    function mint(address account, uint256 amount) external onlyOwner {
        require(account != address(0), "ERC20: mint to the zero address");
        _mint(account, amount);
    } // Mint new tokens and assign them to the specified account.
    // Only the owner of the contract can call this function.
    // Reverts if the specified account is the zero address.

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    } // Burn a specified amount of tokens from the sender's balance.
    // This operation permanently removes tokens from circulation.
}
