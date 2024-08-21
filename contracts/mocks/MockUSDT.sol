// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {}

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }

    function mintFor(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
