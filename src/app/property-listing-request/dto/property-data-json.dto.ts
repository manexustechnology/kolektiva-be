export class PropertyDataJsonDto {
  propertyDetails_propertyStatus_phase: string;
  propertyDetails_propertyStatus_status: string;
  propertyDetails_propertyStatus_rentalStatus: string;
  propertyDetails_issuerDetails_issuedBy: string;
  propertyDetails_issuerDetails_name: string;
  propertyDetails_issuerDetails_phoneNum: string;
  propertyDetails_issuerDetails_email: string;
  propertyDetails_propertySummary_title: string;
  propertyDetails_propertySummary_googleMapUrl: string;
  propertyDetails_propertySummary_country: string;
  propertyDetails_propertySummary_state: string;
  propertyDetails_propertySummary_city: string;
  propertyDetails_propertySummary_district: string;
  propertyDetails_propertySummary_address: string;
  propertyDetails_propertySummary_landArea: number;
  propertyDetails_propertySummary_buildingArea: number;
  propertyDetails_propertySummary_priceEstimation: number;
  propertyDetails_propertyImages_primary: string;
  propertyDetails_propertyImages_others: string[];
  propertyDetails_propertyDetails_planToSell: string;
  propertyDetails_propertyDetails_propertyType: string;
  propertyDetails_propertyDetails_ownershipStatus: string;
  propertyDetails_propertyDetails_propertyCondition: string;
  propertyDetails_propertyDetails_occupancyStatus: string;
  propertyDetails_propertyDetails_propertyManager: string;
  propertyDetails_propertyDetails_furnish: string;
  propertyDetails_propertyDetails_furniture: string;
  propertyDetails_propertyDetails_propertyIssues: string[];
  propertyDetails_propertySpecifications_propertyCertificate: string;
  propertyDetails_propertySpecifications_floors: number;
  propertyDetails_propertySpecifications_waterSupply: string;
  propertyDetails_propertySpecifications_bedrooms: number;
  propertyDetails_propertySpecifications_bathrooms: number;
  propertyDetails_propertySpecifications_garage: string;
  propertyDetails_propertySpecifications_garden: string;
  propertyDetails_propertySpecifications_swimPool: string;
  propertyDetails_description: string;

  financials_token_tokenPrice: number;
  financials_token_tokenSupply: number;
  financials_token_tokenValue: number;
  financials_propertyFinancials_furnitureValueEstimation: number;
  financials_propertyFinancials_legalAdminCost: number;
  financials_propertyFinancials_platformListingFee: number;
  financials_propertyFinancials_marketingMangementCost: number;
  financials_propertyFinancials_propertyTaxes: number;
  financials_propertyFinancials_rentalTaxes: number;
  financials_propertyFinancials_rentalYeild: number;

  documents_documents: string[];

  markets_markets: string;

  errmsg: boolean;
  validEmail: boolean;
  validMap: boolean;
}
