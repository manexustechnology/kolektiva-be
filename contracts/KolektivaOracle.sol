// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title KolektivaOracle
 * @dev This contract manages the price data for different property categories, allowing updates and retrievals.
 */
contract KolektivaOracle is Ownable, Pausable {
    error FrequencyNotMet();
    error PriceAboveThreshold();
    error CategoryPriceNotSet();
    error MismatchHashesAndPricesLength();

    struct PriceData {
        uint256 averagePricePerSqm;
        uint256 lastUpdateTimestamp;
    }

    mapping(bytes32 => PriceData) public categoryPriceData;

    uint256 public constant PRICE_PRECISION = 1e6; // 6 decimal places for price per sqm
    uint256 private _threshold = (10 * PRICE_PRECISION) / 100; // 10% threshold for updates
    uint256 private _frequency = 1 hours; // Minimum time between updates

    event CategoryPriceUpdated(
        bytes32 indexed categoryHash,
        uint256 newPrice,
        uint256 updateTime
    );
    event ThresholdChanged(uint256 newThreshold);
    event FrequencyChanged(uint256 newFrequency);

    /**
     * @dev Constructor to initialize the contract with the owner.
     * @param _owner The address of the contract owner.
     */
    constructor(address _owner) Ownable(_owner) Pausable() {}

    /**
     * @dev Updates the average price per square meter for a specific category.
     * @param _categoryHash The hash of the category.
     * @param _newAveragePricePerSqm The new average price per square meter.
     *
     * Requirements:
     * - Only the owner can call this function.
     * - The contract must not be paused.
     * - The update frequency must be met.
     * - The price change must be within the allowed threshold.
     *
     * Emits a {CategoryPriceUpdated} event.
     */
    function updateCategoryPrice(
        bytes32 _categoryHash,
        uint256 _newAveragePricePerSqm
    ) public onlyOwner whenNotPaused {
        PriceData storage data = categoryPriceData[_categoryHash];
        uint256 currentPrice = data.averagePricePerSqm;
        uint256 currentTimestamp = data.lastUpdateTimestamp;
        uint256 newAveragePricePerSqm = _newAveragePricePerSqm;

        if (
            currentTimestamp > 0 &&
            block.timestamp < currentTimestamp + _frequency
        ) {
            revert FrequencyNotMet();
        }
        if (currentPrice > 0) {
            uint256 priceDifference = absDifference(
                currentPrice,
                newAveragePricePerSqm
            );
            uint256 threshold = (currentPrice * _threshold) / PRICE_PRECISION;

            if (priceDifference > threshold) {
                revert PriceAboveThreshold();
            }
        }

        data.averagePricePerSqm = newAveragePricePerSqm;
        data.lastUpdateTimestamp = block.timestamp;

        emit CategoryPriceUpdated(
            _categoryHash,
            newAveragePricePerSqm,
            block.timestamp
        );
    }

    /**
     * @dev Batch updates the average prices per square meter for multiple categories.
     * @param categoryHashes An array of category hashes.
     * @param newPrices An array of new average prices per square meter.
     *
     * Requirements:
     * - Only the owner can call this function.
     * - The contract must not be paused.
     * - The lengths of categoryHashes and newPrices must match.
     */
    function batchUpdateCategoryPrices(
        bytes32[] memory categoryHashes,
        uint256[] memory newPrices
    ) public onlyOwner whenNotPaused {
        if (categoryHashes.length != newPrices.length) {
            revert MismatchHashesAndPricesLength();
        }
        for (uint256 i = 0; i < categoryHashes.length; i++) {
            updateCategoryPrice(categoryHashes[i], newPrices[i]);
        }
    }

    /**
     * @dev Retrieves the property value based on the category and total area.
     * @param categoryHash The hash of the category.
     * @param totalArea The total area of the property.
     * @return The property value.
     *
     * Requirements:
     * - The category price must be set.
     */
    function getPropertyValue(
        bytes32 categoryHash,
        uint256 totalArea
    ) public view returns (uint256) {
        PriceData memory data = categoryPriceData[categoryHash];
        if (data.averagePricePerSqm == 0) {
            revert CategoryPriceNotSet();
        }
        return (data.averagePricePerSqm * totalArea);
    }

    /**
     * @dev Retrieves the average price per square meter and the last update timestamp for a category.
     * @param categoryHash The hash of the category.
     * @return The average price per square meter and the last update timestamp.
     */
    function getCategoryPrice(
        bytes32 categoryHash
    ) public view returns (uint256, uint256) {
        PriceData memory data = categoryPriceData[categoryHash];
        return (data.averagePricePerSqm, data.lastUpdateTimestamp);
    }

    /**
     * @dev Sets a new threshold for price updates.
     * @param newThreshold The new threshold.
     *
     * Requirements:
     * - Only the owner can call this function.
     *
     * Emits a {ThresholdChanged} event.
     */
    function setThreshold(uint256 newThreshold) public onlyOwner {
        _threshold = newThreshold;
        emit ThresholdChanged(newThreshold);
    }

    /**
     * @dev Retrieves the current threshold for price updates.
     * @return The current threshold.
     */
    function getThreshold() external view returns (uint256) {
        return _threshold;
    }

    /**
     * @dev Sets a new frequency for price updates.
     * @param newFrequency The new frequency in seconds.
     *
     * Requirements:
     * - Only the owner can call this function.
     *
     * Emits a {FrequencyChanged} event.
     */
    function setFrequency(uint256 newFrequency) public onlyOwner {
        _frequency = newFrequency;
        emit FrequencyChanged(newFrequency);
    }

    /**
     * @dev Retrieves the current frequency for price updates.
     * @return The current frequency in seconds.
     */
    function getFrequency() external view returns (uint256) {
        return _frequency;
    }

    /**
     * @dev Pauses the contract, preventing any state-changing functions from being executed.
     *
     * Requirements:
     * - Only the owner can call this function.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses the contract, allowing state-changing functions to be executed.
     *
     * Requirements:
     * - Only the owner can call this function.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Calculates the absolute difference between two numbers.
     * @param a The first number.
     * @param b The second number.
     * @return The absolute difference between a and b.
     */
    function absDifference(
        uint256 a,
        uint256 b
    ) private pure returns (uint256) {
        return a > b ? a - b : b - a;
    }
}
