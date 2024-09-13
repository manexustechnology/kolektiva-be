import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { KolektivaContractService } from './kolektiva-contract.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '../../decorators/response/response.decorator';
import { CreateKolektivaPropertyDto } from './dto/kolektiva-create-property-dto';

@ApiTags('Kolektiva Contract')
@Controller('kolektiva-contract')
export class KolektivaContractController {
  constructor(
    private readonly kolektivaContractService: KolektivaContractService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Successfully created new kolektiva property!',
  })
  @ResponseMessage('Successfully created new kolektiva property!')
  @Post()
  create(@Body() createKolektivaPropertyDto: CreateKolektivaPropertyDto) {
    return this.kolektivaContractService.createProperty(
      createKolektivaPropertyDto,
    );
  }
}
