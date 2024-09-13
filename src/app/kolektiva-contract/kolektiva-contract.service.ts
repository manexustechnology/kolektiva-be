import { Injectable } from '@nestjs/common';
import { ContractInteractionService } from '../contract-interaction/contract-interaction.service';
import { WriteContractDto } from '../contract-interaction/dto/write-contract-dto';
import { CreateKolektivaPropertyDto } from './dto/kolektiva-create-property-dto';
import { error } from 'console';

@Injectable()
export class KolektivaContractService {
  constructor(private contractInteraction: ContractInteractionService) {}

  async createProperty(createKolektivaPropertyDto: CreateKolektivaPropertyDto) {
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
      } = createKolektivaPropertyDto;

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
    } catch (err) {
      throw new Error(`Kolektiva contract error: ${err}`);
    }
  }
}
