// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals_, uint initialSupply)
        ERC20(name, symbol)
    {
        _mint(msg.sender, initialSupply);
        _setupDecimals(decimals_);
    }

    function _setupDecimals(uint8 decimals_) internal {
        assembly {
            sstore(0x6, decimals_) 
        }
    }
}
    