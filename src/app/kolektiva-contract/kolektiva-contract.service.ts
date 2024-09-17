import { Injectable } from '@nestjs/common';
import { ContractInteractionService } from '../contract-interaction/contract-interaction.service';
import { WriteContractDto } from '../contract-interaction/dto/write-contract-dto';
import { KolektivaCreatePropertyDto } from './dto/kolektiva-create-property-dto';
import { error } from 'console';
import { KolektivaApproveMarketDto } from './dto/kolektiva-approve-market-dto';

@Injectable()
export class KolektivaContractService {
  constructor(private contractInteraction: ContractInteractionService) {}

  async createProperty(createPropertyDto: KolektivaCreatePropertyDto) {
    try {
      const {
        chainId,
        name,
        symbol,
        propertyType,
        country,
        state,
        city,
        location,
        totalSupply,
        salePrice,
        propertyOwnerAddress,
      } = createPropertyDto;

      const writeContractDto: WriteContractDto = {
        chainId: chainId.toString(),
        contractName: 'KolektivaHandler',
        functionName: 'createToken',
        args: [
          name,
          symbol,
          propertyType,
          country,
          state,
          city,
          location,
          totalSupply,
          salePrice,
          propertyOwnerAddress,
        ],
        eventName: ['MarketCreated'],
      };
      return await this.contractInteraction.writeFunction(writeContractDto);
    } catch (e) {
      throw new Error(
        JSON.stringify({
          title: `Kolektiva contract error`,
          error: e,
        }),
      );
    }
  }

  async approveMarket(approveMarketDto: KolektivaApproveMarketDto) {
    try {
      const writeContractDto: WriteContractDto = {
        chainId: approveMarketDto.chainId.toString(),
        contractName: 'KolektivaHandler',
        functionName: 'approveMarketToTransferTokens',
        args: [approveMarketDto.name],
      };
      return await this.contractInteraction.writeFunction(writeContractDto);
    } catch (e) {
      throw new Error(
        JSON.stringify({
          title: `Kolektiva contract approve market error`,
          error: e,
        }),
      );
    }
  }
}
