// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {KolektivaToken} from "./KolektivaToken.sol";
import {KolektivaMarket} from "./KolektivaMarket.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title KolektivaHandler
 * @dev This contract handles the creation, management, and revocation of Kolektiva tokens and markets.
 */
contract KolektivaHandler is Ownable {
    error TokenAlreadyExist();
    error TokenDoesNotExist();
    error MarketDoesNotExist();
    error InsufficientBalance();

    IERC20 public immutable usdtToken;

    mapping(string name => address) public tokenAddresses;
    mapping(string name => address) public marketAddresses;
    string[] private tokenNamesList;

    event TokenCreated(string name, address tokenAddress);
    event TokenRevoked(string name, address tokenAddress);
    event MarketCreated(
        string name,
        address tokenAddress,
        address marketAddress
    );
    event MarketRevoked(
        string name,
        address tokenAddress,
        address marketAddress
    );
    event WithdrawnToken(string name, address tokenAddress, uint256 amount);
    event WithdrawnFee(uint256 amount);
    event FeePercentageUpdated(string name, uint256 newFeePercentage);

    /**
     * @dev Constructor to initialize the contract with the owner and USDT token address.
     * @param _owner The address of the contract owner.
     * @param _usdtTokenAddress The address of the USDT token contract.
     */
    constructor(address _owner, address _usdtTokenAddress) Ownable(_owner) {
        usdtToken = IERC20(_usdtTokenAddress);
    }

    modifier tokenShouldNotExist(string memory name) {
        if (tokenAddresses[name] != address(0)) {
            revert TokenAlreadyExist();
        }
        _;
    }

    modifier tokenShouldExist(string memory name) {
        if (tokenAddresses[name] == address(0)) {
            revert TokenDoesNotExist();
        }
        _;
    }

    modifier marketShouldExist(string memory name) {
        if (marketAddresses[name] == address(0)) {
            revert MarketDoesNotExist();
        }
        _;
    }

    /**
     * @dev Creates a new Kolektiva token and market.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param propertyType The type of the property.
     * @param country The country where the property is located.
     * @param state The state where the property is located.
     * @param city The city where the property is located.
     * @param location The specific location of the property.
     * @param totalSupply The total supply of the token.
     * @param salePrice The sale price of the token in USDT.
     * @param propertyOwner The address of the property owner.
     */
    function createToken(
        string memory name,
        string memory symbol,
        string memory propertyType,
        string memory country,
        string memory state,
        string memory city,
        string memory location,
        uint256 totalSupply,
        uint256 salePrice,
        address propertyOwner
    ) external onlyOwner tokenShouldNotExist(name) {
        KolektivaToken newToken = new KolektivaToken(
            name,
            symbol,
            propertyType,
            country,
            state,
            city,
            location,
            totalSupply,
            address(this)
        );
        tokenNamesList.push(name);
        tokenAddresses[name] = address(newToken);
        KolektivaMarket newMarket = new KolektivaMarket(
            address(newToken),
            address(usdtToken),
            propertyOwner,
            address(this),
            salePrice
        );
        marketAddresses[name] = address(newMarket);

        emit TokenCreated(name, address(newToken));
        emit MarketCreated(name, address(newToken), address(newMarket));
    }

    /**
     * @dev Mints new tokens to a specified address.
     * @param name The name of the token.
     * @param to The address to mint the tokens to.
     * @param amount The amount of tokens to mint.
     */
    function mintTokens(
        string memory name,
        address to,
        uint256 amount
    ) external onlyOwner tokenShouldExist(name) {
        KolektivaToken(tokenAddresses[name]).mint(to, amount);
    }

    /**
     * @dev Burns tokens from a specified address.
     * @param name The name of the token.
     * @param from The address to burn the tokens from.
     * @param amount The amount of tokens to burn.
     */
    function burnTokens(
        string memory name,
        address from,
        uint256 amount
    ) external onlyOwner tokenShouldExist(name) {
        KolektivaToken(tokenAddresses[name]).burn(from, amount);
    }

    /**
     * @dev Revokes a token and its associated market.
     * @param name The name of the token to revoke.
     */
    function revokeToken(
        string memory name
    ) external onlyOwner tokenShouldExist(name) {
        address tokenAddress = tokenAddresses[name];
        address marketAddress = marketAddresses[name];
        delete tokenAddresses[name];
        _removeTokenName(name);
        delete marketAddresses[name];
        emit TokenRevoked(name, tokenAddress);
        emit MarketRevoked(name, tokenAddress, marketAddress);
    }

    /**
     * @dev Removes a token name from the list of token names.
     * @param name The name of the token to remove.
     */
    function _removeTokenName(string memory name) private {
        for (uint256 i = 0; i < tokenNamesList.length; i++) {
            if (keccak256(bytes(tokenNamesList[i])) == keccak256(bytes(name))) {
                // Move the last element to the position of the element to delete
                tokenNamesList[i] = tokenNamesList[tokenNamesList.length - 1];
                // Remove the last element
                tokenNamesList.pop();
                break;
            }
        }
    }

    /**
     * @dev Withdraws a specified amount of tokens.
     * @param name The name of the token.
     * @param amount The amount of tokens to withdraw.
     */
    function withdrawToken(
        string memory name,
        uint256 amount
    ) external onlyOwner tokenShouldExist(name) {
        address tokenAddress = tokenAddresses[name];
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        if (balance < amount) {
            revert InsufficientBalance();
        }

        token.transfer(owner(), amount);
        emit WithdrawnToken(name, tokenAddress, amount);
    }

    /**
     * @dev Withdraws a specified amount of USDT as fees.
     * @param amount The amount of USDT to withdraw.
     */
    function withdrawFee(uint256 amount) external onlyOwner {
        IERC20 token = IERC20(usdtToken);
        uint256 balance = usdtToken.balanceOf(address(this));
        if (balance < amount) {
            revert InsufficientBalance();
        }

        token.transfer(owner(), amount);
        emit WithdrawnFee(amount);
    }

    /**
     * @dev Sets the fee percentage for a specified market.
     * @param name The name of the token associated with the market.
     * @param _newFeePercentage The new fee percentage to set.
     */
    function setFeePercentage(
        string memory name,
        uint256 _newFeePercentage
    ) external onlyOwner marketShouldExist(name) {
        KolektivaMarket market = KolektivaMarket(marketAddresses[name]);
        market.setFeePercentage(_newFeePercentage);
        emit FeePercentageUpdated(name, _newFeePercentage);
    }

    /**
     * @dev Approves the market to transfer tokens on behalf of the contract.
     * @param name The name of the token.
     */
    function approveMarketToTransferTokens(
        string memory name
    ) external onlyOwner tokenShouldExist(name) {
        KolektivaToken token = KolektivaToken(tokenAddresses[name]);
        token.approve(marketAddresses[name], token.totalSupply());
    }

    /**
     * @dev Returns the list of token names.
     * @return An array of token names.
     */
    function getTokenNames() external view returns (string[] memory) {
        return tokenNamesList;
    }

    /**
     * @dev Checks the balance of a specified token.
     * @param name The name of the token.
     * @return The balance of the token.
     */
    function checkTokenBalance(
        string memory name
    ) external view returns (uint256) {
        address tokenAddress = tokenAddresses[name];
        if (tokenAddress == address(0)) {
            revert TokenDoesNotExist();
        }

        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
}
