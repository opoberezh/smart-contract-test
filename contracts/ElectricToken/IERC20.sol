// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IERC20 {
  function name() external view returns(string memory); //thi is a name our Token;
  function symbol() external view returns(string memory); //a short name our Token;
  function decimals() external pure returns(uint); // how many symbols after koma 18 or 0;
  function totalSupplay() external view returns(uint);//how many Tokens in circulation;
  function mint(address account, uint amount) external; //to creat the new Tokens;
  function burn(uint amount) external; //to burn the unnecessory Tokens;
  function balanceOf(address account) external view returns(uint);//namber of Tokens on client's balance;
  function addToBlackList(address account) external;
  function removeFromBlackList(address account) external;
  function transfer(address to, uint amount) external; //transfer amount Tokens to address; 
  function allowance(address owner, address spender) external view returns(uint); //if we have a store, we allowed to withdraw Tokens from owner's address to spender's address;
  function approve(address spender, uint amount) external; // approve transfer;
  function transferFrom(address sender, address recipient, uint amount) external;
  event Transfer(address indexed from, address indexed to, uint amount);
  event Approve(address indexed owner, address indexed to, uint amount);//approve to withdraw from owner's wallet;
}