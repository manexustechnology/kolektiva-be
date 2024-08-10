interface SignatureDetails {
  [signatureName: string]: string;
}

interface DeployedSignatures {
  [chainId: string]: {
    [contractName: string]: SignatureDetails;
  };
}

export const deployedSignatures: DeployedSignatures = {
  "4202": {
    MockUSDT: {
      Approval:
        "event Approval(address indexed owner, address indexed spender, uint256 value)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      Transfer:
        "event Transfer(address indexed from, address indexed to, uint256 value)",
    },
    KolektivaOracle: {
      CategoryPriceUpdated:
        "event CategoryPriceUpdated(bytes32 indexed categoryHash, uint256 newPrice, uint256 updateTime)",
      FrequencyChanged: "event FrequencyChanged(uint256 newFrequency)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      Paused: "event Paused(address account)",
      ThresholdChanged: "event ThresholdChanged(uint256 newThreshold)",
      Unpaused: "event Unpaused(address account)",
    },
    KolektivaHandler: {
      FeePercentageUpdated:
        "event FeePercentageUpdated(string name, uint256 newFeePercentage)",
      MarketCreated:
        "event MarketCreated(string name, address tokenAddress, address marketAddress)",
      MarketRevoked:
        "event MarketRevoked(string name, address tokenAddress, address marketAddress)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      TokenCreated: "event TokenCreated(string name, address tokenAddress)",
      TokenRevoked: "event TokenRevoked(string name, address tokenAddress)",
      WithdrawnFee: "event WithdrawnFee(uint256 amount)",
      WithdrawnToken:
        "event WithdrawnToken(string name, address tokenAddress, uint256 amount)",
    },
    KolektivaMarket: {
      InitialOfferingPurchase:
        "event InitialOfferingPurchase(address indexed buyer, uint256 amount, uint256 totalCost, uint256 fee)",
      InstantTrade:
        "event InstantTrade(address indexed trader, uint256 amount, uint256 totalPrice, bool isBuy)",
      OrderCancelled:
        "event OrderCancelled(address indexed trader, uint256 amount, uint256 price, bool isBuyOrder)",
      OrderFulfilled:
        "event OrderFulfilled(address indexed buyer, address indexed seller, uint256 amount, uint256 price)",
      OrderPlaced:
        "event OrderPlaced(address indexed trader, uint256 amount, uint256 price, bool isBuyOrder)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      PriceUpdated: "event PriceUpdated(uint256 newPrice)",
      PropertyOwnerWithdrawal:
        "event PropertyOwnerWithdrawal(address indexed owner, uint256 amount)",
    },
    KolektivaToken: {
      Approval:
        "event Approval(address indexed owner, address indexed spender, uint256 value)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      Transfer:
        "event Transfer(address indexed from, address indexed to, uint256 value)",
    },
  },
  "31337": {
    MockUSDT: {
      Approval:
        "event Approval(address indexed owner, address indexed spender, uint256 value)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      Transfer:
        "event Transfer(address indexed from, address indexed to, uint256 value)",
    },
    KolektivaOracle: {
      CategoryPriceUpdated:
        "event CategoryPriceUpdated(bytes32 indexed categoryHash, uint256 newPrice, uint256 updateTime)",
      FrequencyChanged: "event FrequencyChanged(uint256 newFrequency)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      Paused: "event Paused(address account)",
      ThresholdChanged: "event ThresholdChanged(uint256 newThreshold)",
      Unpaused: "event Unpaused(address account)",
    },
    KolektivaHandler: {
      FeePercentageUpdated:
        "event FeePercentageUpdated(string name, uint256 newFeePercentage)",
      MarketCreated:
        "event MarketCreated(string name, address tokenAddress, address marketAddress)",
      MarketRevoked:
        "event MarketRevoked(string name, address tokenAddress, address marketAddress)",
      OwnershipTransferred:
        "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
      TokenCreated: "event TokenCreated(string name, address tokenAddress)",
      TokenRevoked: "event TokenRevoked(string name, address tokenAddress)",
      WithdrawnFee: "event WithdrawnFee(uint256 amount)",
      WithdrawnToken:
        "event WithdrawnToken(string name, address tokenAddress, uint256 amount)",
    },
  },
};
