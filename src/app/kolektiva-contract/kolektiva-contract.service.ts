import { Injectable } from '@nestjs/common';
import { ContractInteractionService } from '../contract-interaction/contract-interaction.service';
import { WriteContractDto } from '../contract-interaction/dto/write-contract-dto';
import { CreateKolektivaPropertyDto } from './dto/kolektiva-create-property-dto';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class KolektivaContractService {
  constructor(
    private prisma: PrismaService,
    private contractInteraction: ContractInteractionService,
  ) {}

  async createProperty(createKolektivaPropertyDto: CreateKolektivaPropertyDto) {
    const {
      chainId,
      address,
      propertyType,
      country,
      state,
      city,
      location,
      totalSupply,
      salePrice,
      propertyOwner,
    } = createKolektivaPropertyDto;
    const symbol = await this.generateTokenSymbol();
    const writeContractDto: WriteContractDto = {
      chainId: chainId.toString(),
      contractName: 'KolektivaHandler',
      functionName: 'createToken',
      args: [
        address,
        symbol,
        propertyType,
        country,
        state,
        city,
        location,
        totalSupply,
        salePrice,
        propertyOwner,
      ],
    };
    const result =
      await this.contractInteraction.writeFunction(writeContractDto);
    console.log(result);
    return result;
  }

  async generateTokenSymbol() {
    const count = (await this.prisma.property.count()) + 1;
    const prefix = 'KLV';
    const maxLimit = 9999; // KLV0001 format

    if (count <= maxLimit) {
      return prefix + count.toString().padStart(4, '0');
    }
    return prefix + count.toString();
  }
}
