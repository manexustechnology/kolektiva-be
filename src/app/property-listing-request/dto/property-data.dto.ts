export class PropertyDataDto {
  propertyDetails: {
    propertyStatus: {
      phase: string;
      status: string;
      rentalStatus: string;
    };
    issuerDetails: {
      issuedBy: string;
      name: string;
      phoneNum: string;
      email: string;
    };
    propertySummary: {
      title: string;
      googleMapUrl: string;
      country: string;
      state: string;
      city: string;
      district: string;
      address: string;
      landArea: number;
      buildingArea: number;
      priceEstimation: number;
    };
    propertyImages: {
      primary: string;
      others: string[];
    };
    propertyDetails: {
      planToSell: string;
      propertyType: string;
      ownershipStatus: string;
      propertyCondition: string;
      occupancyStatus: string;
      propertyManager: string;
      furnish: string;
      furniture: string;
      propertyIssues: string[];
    };
    propertySpecifications: {
      propertyCertificate: string;
      floors: number;
      waterSupply: string;
      bedrooms: number;
      bathrooms: number;
      garage: string;
      garden: string;
      swimPool: string;
    };
    description: string;
  };
  chain: {
    chainName: string;
    chainId: number;
  };
  financials: {
    token: {
      tokenPrice: number;
      tokenSupply: number;
      tokenValue: number;
    };
    propertyFinancials: {
      furnitureValueEstimation: number;
      legalAdminCost: number;
      platformListingFee: number;
      marketingMangementCost: number;
      propertyTaxes: number;
      rentalTaxes: number;
      rentalYeild: number;
    };
  };
  documents: {
    documents: string[];
  };
  markets: {
    markets: string;
  };
  errmsg: boolean;
  validEmail: boolean;
  validMap: boolean;
}
