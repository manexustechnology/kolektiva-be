// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {OrderLib} from "./OrderLib.sol";

/**
 * @title KolektivaMarket
 * @dev A decentralized market for trading Kolektiva tokens using USDT.
 */
contract KolektivaMarket is Ownable, ReentrancyGuard {
    using OrderLib for OrderLib.Order[];

    // Custom errors for better gas efficiency
    error InsufficientBalance(uint256 available, uint256 required);
    error Unauthorized();
    error InvalidOrder();
    error InitialOfferingEnded();
    error InitialOfferingOngoing();
    error InsufficientSupply();
    error TransferFailed();
    error InvalidAmount();
    error NoFundsToWithdraw();
    error IndexOutOfBounds();

    // State variables
    IERC20 public immutable kolektivaToken;
    IERC20 public immutable usdtToken;
    uint256 public immutable salePrice;
    address public immutable handler;
    address public immutable propertyOwner;

    uint128 public constant FEE_PRECISION = 1e4;

    uint256 public propertyOwnerBalance;
    uint128 public feePercentage = 500; // 500 / 10000 = 5%
    uint256 public initialOfferingSupply;
    uint256 public lastTradedPrice;
    uint256 private nextOrderId = 0;
    bool public initialOfferingActive = true;

    OrderLib.Order[] private buyOrders;
    OrderLib.Order[] private sellOrders;

    // Events
    event OrderPlaced(
        address indexed trader,
        uint256 amount,
        uint256 price,
        bool isBuyOrder,
        uint256 timestamp
    );
    event OrderFulfilled(
        address indexed buyer,
        address indexed seller,
        uint256 amount,
        uint256 price,
        uint256 timestamp
    );
    event OrderCancelled(
        address indexed trader,
        uint256 amount,
        uint256 price,
        bool isBuyOrder,
        uint256 timestamp
    );
    event InstantTrade(
        address indexed trader,
        uint256 amount,
        uint256 totalPrice,
        bool isBuy,
        uint256 timestamp
    );
    event InitialOfferingPurchase(
        address indexed buyer,
        uint256 amount,
        uint256 totalCost,
        uint256 fee,
        uint256 timestamp
    );
    event PropertyOwnerWithdrawal(address indexed owner, uint256 amount);
    event PriceUpdated(uint256 newPrice);

    /**
     * @dev Constructor to initialize the contract.
     * @param _kolektivaToken Address of the Kolektiva token contract.
     * @param _usdtToken Address of the USDT token contract.
     * @param _propertyOwner Address of the property owner.
     * @param _handler Address of the handler.
     * @param _salePrice Sale price of the Kolektiva token during the initial offering.
     */
    constructor(
        address _kolektivaToken,
        address _usdtToken,
        address _propertyOwner,
        address _handler,
        uint256 _salePrice
    ) Ownable(_handler) {
        kolektivaToken = IERC20(_kolektivaToken);
        usdtToken = IERC20(_usdtToken);
        handler = _handler;
        propertyOwner = _propertyOwner;
        initialOfferingSupply = kolektivaToken.totalSupply();
        salePrice = _salePrice;
    }

    /**
     * @dev Modifier to check if the initial offering is ongoing.
     * @param shouldBeActive Boolean indicating if the initial offering should be active.
     */
    modifier initialOfferingOngoing(bool shouldBeActive) {
        if (initialOfferingActive != shouldBeActive) {
            if (shouldBeActive) {
                revert InitialOfferingEnded();
            } else {
                revert InitialOfferingOngoing();
            }
        }
        _;
    }

    /**
     * @dev Modifier to check if the order index is valid.
     * @param index Index of the order.
     * @param isBuyOrder Boolean indicating if it is a buy order.
     */
    modifier validOrderIndex(uint256 index, bool isBuyOrder) {
        if (index >= (isBuyOrder ? buyOrders.length : sellOrders.length)) {
            revert IndexOutOfBounds();
        }
        _;
    }

    /**
     * @dev Function to buy tokens during the initial offering.
     * @param _amount Amount of tokens to buy.
     * @notice This function can only be called while the initial offering is active.
     */
    function initialOfferingBuy(
        uint256 _amount
    ) external initialOfferingOngoing(true) nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        if (_amount > initialOfferingSupply) {
            revert InsufficientSupply();
        }

        uint256 totalCost = (_amount * salePrice);
        uint256 fee = (totalCost * feePercentage) / FEE_PRECISION;
        uint256 totalAmount = totalCost + fee;

        if (!usdtToken.transferFrom(msg.sender, address(this), totalAmount)) {
            revert TransferFailed();
        }
        propertyOwnerBalance += totalCost;

        if (!usdtToken.transfer(handler, fee)) {
            revert TransferFailed();
        }
        if (!kolektivaToken.transferFrom(handler, msg.sender, _amount)) {
            revert TransferFailed();
        }

        unchecked {
            initialOfferingSupply -= _amount;
        }
        if (initialOfferingSupply == 0) {
            initialOfferingActive = false;
        }

        emit InitialOfferingPurchase(
            msg.sender,
            _amount,
            totalCost,
            fee,
            block.timestamp
        );
    }

    /**
     * @dev Internal function to remove an order from the order list.
     * @param _index Index of the order to remove.
     * @param isBuyOrder Boolean indicating if it is a buy order.
     */
    function _removeOrder(
        uint256 _index,
        bool isBuyOrder
    ) internal validOrderIndex(_index, isBuyOrder) {
        OrderLib.Order[] storage orders = isBuyOrder ? buyOrders : sellOrders;

        for (uint256 i = _index; i < orders.length - 1; i++) {
            orders[i] = orders[i + 1];
        }

        orders.pop();
    }

    /**
     * @dev Function to place a buy order.
     * @param _amount Amount of tokens to buy.
     * @param _price Price per token.
     * @notice This function can only be called after the initial offering has ended.
     */
    function placeBuyOrder(
        uint256 _amount,
        uint256 _price
    ) external initialOfferingOngoing(false) nonReentrant {
        uint256 totalCost = _amount * _price;
        uint256 fee = (totalCost * feePercentage) / FEE_PRECISION;

        // Transfer USDT from buyer to contract (including fee)
        if (
            !usdtToken.transferFrom(msg.sender, address(this), totalCost + fee)
        ) {
            revert TransferFailed();
        }

        // Transfer the fee to the handler
        if (!usdtToken.transfer(handler, fee)) {
            revert TransferFailed();
        }

        // Create and insert the new buy order with an orderId
        OrderLib.Order memory newOrder = OrderLib.Order({
            trader: msg.sender,
            amount: _amount,
            price: _price,
            orderId: nextOrderId++
        });

        // Insert the new order in sorted order by price and orderId
        buyOrders.push(newOrder);
        buyOrders.addOrderToSortedList(newOrder, true);

        emit OrderPlaced(msg.sender, _amount, _price, true, block.timestamp);
        _matchOrders();
    }

    /**
     * @dev Function to place a sell order.
     * @param _amount Amount of tokens to sell.
     * @param _price Price per token.
     * @notice This function can only be called after the initial offering has ended.
     */
    function placeSellOrder(
        uint256 _amount,
        uint256 _price
    ) external initialOfferingOngoing(false) nonReentrant {
        uint256 totalProceeds = _amount * _price;
        uint256 fee = (totalProceeds * feePercentage) / FEE_PRECISION;

        // Transfer tokens from seller to contract
        if (!kolektivaToken.transferFrom(msg.sender, address(this), _amount)) {
            revert TransferFailed();
        }

        // Transfer the fee to the handler
        if (!usdtToken.transferFrom(msg.sender, handler, fee)) {
            revert TransferFailed();
        }

        // Create and insert the new sell order with an orderId
        OrderLib.Order memory newOrder = OrderLib.Order({
            trader: msg.sender,
            amount: _amount,
            price: _price,
            orderId: nextOrderId++
        });

        // Insert the new order in sorted order by price and orderId
        sellOrders.push(newOrder);
        sellOrders.addOrderToSortedList(newOrder, false);

        emit OrderPlaced(msg.sender, _amount, _price, false, block.timestamp);
        _matchOrders();
    }

    /**
     * @dev Function to instantly buy tokens from the sell orders.
     * @param _amount Amount of tokens to buy.
     * @notice This function can only be called after the initial offering has ended.
     */
    function instantBuy(
        uint256 _amount
    ) external initialOfferingOngoing(false) nonReentrant {
        if (_amount == 0) revert InvalidAmount();

        uint256 remainingAmount = _amount;
        uint256 totalCost = 0;
        uint256 processedCount = 0;

        // Prepare the transactions by determining which sell orders will be processed
        for (uint256 i = 0; i < sellOrders.length && remainingAmount > 0; i++) {
            OrderLib.Order memory sellOrder = sellOrders[i];
            uint256 tradeAmount = sellOrder.amount < remainingAmount
                ? sellOrder.amount
                : remainingAmount;
            uint256 cost = tradeAmount * sellOrder.price;

            if (!usdtToken.transferFrom(msg.sender, address(this), cost)) {
                revert TransferFailed();
            }

            totalCost += cost;
            // Execute the trade
            _executeTrade(
                msg.sender,
                sellOrder.trader,
                tradeAmount,
                sellOrder.price
            );

            unchecked {
                remainingAmount -= tradeAmount;
                sellOrders[i].amount -= tradeAmount;
            }

            if (sellOrders[i].amount == 0) {
                processedCount++;
            } else {
                break;
            }
        }

        // Check for remaining amount after processing all possible orders
        if (remainingAmount > 0) revert InsufficientSupply();

        // Shift the remaining orders and remove the fully executed ones
        for (uint256 i = 0; i < sellOrders.length - processedCount; i++) {
            sellOrders[i] = sellOrders[i + processedCount];
        }
        for (uint256 i = 0; i < processedCount; i++) {
            sellOrders.pop();
        }

        // Fee calculation
        uint256 fee = (totalCost * feePercentage) / FEE_PRECISION;

        if (!usdtToken.transferFrom(msg.sender, handler, fee)) {
            revert TransferFailed();
        }

        emit InstantTrade(
            msg.sender,
            _amount,
            totalCost,
            true,
            block.timestamp
        );
    }

    /**
     * @dev Function to instantly sell tokens to the buy orders.
     * @param _amount Amount of tokens to sell.
     */
    function instantSell(uint256 _amount) external nonReentrant {
        if (_amount == 0) revert InvalidAmount();
        if (!kolektivaToken.transferFrom(msg.sender, address(this), _amount)) {
            revert TransferFailed();
        }

        uint256 remainingAmount = _amount;
        uint256 totalProceeds = 0;
        uint256 processedCount = 0;

        // Prepare the transactions by determining which buy orders will be processed
        for (uint256 i = buyOrders.length; i > 0 && remainingAmount > 0; i--) {
            OrderLib.Order memory buyOrder = buyOrders[i - 1];
            uint256 tradeAmount = buyOrder.amount < remainingAmount
                ? buyOrder.amount
                : remainingAmount;
            uint256 proceeds = tradeAmount * buyOrder.price;

            totalProceeds += proceeds;

            // Execute the trade
            _executeTrade(
                buyOrder.trader,
                msg.sender,
                tradeAmount,
                buyOrder.price
            );

            unchecked {
                remainingAmount -= tradeAmount;
                buyOrders[i - 1].amount -= tradeAmount;
            }

            if (buyOrders[i - 1].amount == 0) {
                processedCount++;
            } else {
                break;
            }
        }

        // Check for remaining amount after processing all possible orders
        if (remainingAmount > 0) revert InsufficientSupply();

        // Shift the remaining orders and remove the fully executed ones
        for (
            uint256 i = buyOrders.length - processedCount;
            i < buyOrders.length - 1;
            i++
        ) {
            buyOrders[i] = buyOrders[i + processedCount];
        }
        for (uint256 i = 0; i < processedCount; i++) {
            buyOrders.pop();
        }

        // Fee calculation
        uint256 fee = (totalProceeds * feePercentage) / FEE_PRECISION;

        if (!usdtToken.transferFrom(msg.sender, handler, fee)) {
            revert TransferFailed();
        }

        emit InstantTrade(
            msg.sender,
            _amount,
            totalProceeds,
            false,
            block.timestamp
        );
    }

    /**
     * @dev Function to cancel an order.
     * @param _index Index of the order to cancel.
     * @param isBuyOrder Boolean indicating if it is a buy order.
     */
    function cancelOrder(
        uint256 _index,
        bool isBuyOrder
    ) external nonReentrant {
        OrderLib.Order memory order = isBuyOrder
            ? buyOrders[_index]
            : sellOrders[_index];

        if (order.trader != msg.sender) revert Unauthorized();

        if (isBuyOrder) {
            if (_index >= buyOrders.length) revert InvalidOrder();
            uint256 refund = (order.amount * order.price);
            _removeOrder(_index, true);
            if (!usdtToken.transfer(msg.sender, refund)) {
                revert TransferFailed();
            }
        } else {
            if (_index >= sellOrders.length) revert InvalidOrder();
            _removeOrder(_index, false);
            if (!kolektivaToken.transfer(msg.sender, order.amount)) {
                revert TransferFailed();
            }
        }

        emit OrderCancelled(
            msg.sender,
            order.amount,
            order.price,
            isBuyOrder,
            block.timestamp
        );
    }

    /**
     * @dev Internal function to match buy and sell orders.
     */
    function _matchOrders() internal {
        while (buyOrders.length > 0 && sellOrders.length > 0) {
            OrderLib.Order memory buyOrder = buyOrders[buyOrders.length - 1];
            OrderLib.Order memory sellOrder = sellOrders[0];

            if (buyOrder.price >= sellOrder.price) {
                uint256 matchedAmount = buyOrder.amount < sellOrder.amount
                    ? buyOrder.amount
                    : sellOrder.amount;
                uint256 matchedPrice = sellOrder.price;

                _executeTrade(
                    buyOrder.trader,
                    sellOrder.trader,
                    matchedAmount,
                    matchedPrice
                );

                if (matchedAmount == buyOrder.amount) {
                    buyOrders.pop();
                } else {
                    unchecked {
                        buyOrder.amount -= matchedAmount; // Reduce the amount in the buy order
                    }
                }

                if (matchedAmount == sellOrder.amount) {
                    _removeOrder(0, false);
                } else {
                    unchecked {
                        sellOrder.amount -= matchedAmount; // Reduce the amount in the sell order
                    }
                }
            } else {
                break;
            }
        }
    }

    /**
     * @dev Internal function to execute a trade between a buyer and a seller.
     * @param _buyer Address of the buyer.
     * @param _seller Address of the seller.
     * @param _amount Amount of tokens to trade.
     * @param _price Price per token.
     */
    function _executeTrade(
        address _buyer,
        address _seller,
        uint256 _amount,
        uint256 _price
    ) internal {
        uint256 totalPrice = (_amount * _price);

        if (!kolektivaToken.transfer(_buyer, _amount)) {
            revert TransferFailed();
        }
        if (!usdtToken.transfer(_seller, totalPrice)) {
            revert TransferFailed();
        }

        emit OrderFulfilled(_buyer, _seller, _amount, _price, block.timestamp);
        updateLastTradedPrice(_price);
    }

    /**
     * @dev Function to set the fee percentage.
     * @param _newFeePercentage New fee percentage.
     * @notice Only the owner can call this function.
     */
    function setFeePercentage(uint256 _newFeePercentage) external onlyOwner {
        if (_newFeePercentage > 1000) revert InvalidAmount();
        feePercentage = uint128(_newFeePercentage);
    }

    /**
     * @dev Function to end the initial offering.
     * @notice Only the owner can call this function.
     */
    function endInitialOffering() external onlyOwner {
        initialOfferingActive = false;
    }

    /**
     * @dev Internal function to update the last traded price.
     * @param _newPrice New price.
     */
    function updateLastTradedPrice(uint256 _newPrice) internal {
        lastTradedPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    /**
     * @dev Function to withdraw funds for the property owner.
     * @notice This function can only be called after the initial offering has ended.
     */
    function withdrawPropertyOwnerFunds()
        external
        initialOfferingOngoing(false)
    {
        if (msg.sender != propertyOwner) revert Unauthorized();
        uint256 balance = propertyOwnerBalance;
        propertyOwnerBalance = 0;

        if (balance == 0) revert NoFundsToWithdraw();
        if (!usdtToken.transfer(propertyOwner, balance)) {
            revert TransferFailed();
        }
        emit PropertyOwnerWithdrawal(propertyOwner, balance);
    }

    /**
     * @dev Function to get the count of buy orders.
     * @return The count of buy orders.
     */
    function getBuyOrdersCount() external view returns (uint256) {
        return buyOrders.length;
    }

    /**
     * @dev Function to get the count of sell orders.
     * @return The count of sell orders.
     */
    function getSellOrdersCount() external view returns (uint256) {
        return sellOrders.length;
    }

    /**
     * @dev Function to get a buy order by index.
     * @param index Index of the buy order.
     * @return The buy order at the specified index.
     */
    function getBuyOrderByIndex(
        uint256 index
    ) public view validOrderIndex(index, true) returns (OrderLib.Order memory) {
        return buyOrders[index];
    }

    function getSellOrderByIndex(
        uint256 index
    )
        public
        view
        validOrderIndex(index, false)
        returns (OrderLib.Order memory)
    {
        return sellOrders[index];
    }

    function calculateBuyCost(
        uint256 _amount
    ) external view returns (uint256 totalCost, uint256 fees) {
        uint256 remainingAmount = _amount;
        totalCost = 0;

        uint256 i = 0;
        uint256 sellOrdersLength = sellOrders.length;
        while (i < sellOrdersLength && remainingAmount > 0) {
            OrderLib.Order memory order = sellOrders[i];
            uint256 availableAmount = remainingAmount < order.amount
                ? remainingAmount
                : order.amount;
            totalCost += (availableAmount * order.price);
            unchecked {
                remainingAmount -= availableAmount;
                i++;
            }
        }

        if (remainingAmount > 0) revert InsufficientSupply();

        fees = (totalCost * feePercentage) / FEE_PRECISION;
        totalCost += fees;
    }

    function calculateSellProceeds(
        uint256 _amount
    ) external view returns (uint256 totalProceeds, uint256 fees) {
        uint256 remainingAmount = _amount;
        totalProceeds = 0;

        uint256 i = buyOrders.length;
        while (i > 0 && remainingAmount > 0) {
            OrderLib.Order memory order = buyOrders[i - 1];
            uint256 availableAmount = remainingAmount < order.amount
                ? remainingAmount
                : order.amount;
            totalProceeds += (availableAmount * order.price);
            unchecked {
                remainingAmount -= availableAmount;
                i--;
            }
        }

        if (remainingAmount > 0) revert InsufficientSupply();

        fees = (totalProceeds * feePercentage) / FEE_PRECISION;
        totalProceeds -= fees;
    }
}
