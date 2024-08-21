// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

library OrderLib {
    struct Order {
        address trader;
        uint256 amount;
        uint256 price;
        uint256 orderId;
    }

    function addOrderToSortedList(
        Order[] storage orders,
        Order memory newOrder,
        bool isBuyOrder
    ) internal {
        uint256 index = orders.length - 1;
        uint256 i = index;
        while (i > 0 && compareOrders(orders[i - 1], newOrder, isBuyOrder)) {
            orders[i] = orders[i - 1];
            i--;
        }
        orders[i] = newOrder;
    }

    function compareOrders(
        Order memory a,
        Order memory b,
        bool isBuyOrder
    ) internal pure returns (bool) {
        if (isBuyOrder) {
            return (a.price > b.price ||
                (a.price == b.price && a.orderId < b.orderId));
        } else {
            return (a.price < b.price ||
                (a.price == b.price && a.orderId < b.orderId));
        }
    }
}
