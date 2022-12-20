// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//@dev MockERC20 for testing
contract MockERC20 is ERC20 {
    constructor(uint256 initialSupply) ERC20("wrapperUSDT", "wUSDT") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    receive() external payable{}
}