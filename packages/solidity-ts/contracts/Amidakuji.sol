pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Amidakuji {
  // event SetPurpose(address sender, string purpose);
  //string public purpose = "Building Unstoppable Apps!";

  constructor() {}

  /*
  function setPurpose(string memory newPurpose) public {
      purpose = newPurpose;
      console.log(msg.sender,"set purpose to",purpose);
      // emit SetPurpose(msg.sender, purpose);
  }
  */

  function setup() public returns (uint256) {
    // ownable
    // setup a new game
    return 1; // gameId
  }

  function game(uint256 gameId) public returns (string memory) {
    return "game data";
  }

  function entry() public returns (bool) {
    return true; // succeed
    // store entry data to storage (public?)
  }

  function draw(uint256 kuji, uint256 pos) public returns (bool) {
    return true;
    // store drawing info to private storage
  }

  function reveal() public {
    // ownable
    // move private storage data to public one
  }

  function result() public {
    // return winner id? address?
  }
}
