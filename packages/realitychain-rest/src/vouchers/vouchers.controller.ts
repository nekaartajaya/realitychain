import { Controller, Post, Body } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import {
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
} from '@realitychain/api';
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post('set-metadata')
  async setMetadata(@Body() metadataDto: NftSetSeriesTokenMetadataDto) {
    return await this.vouchersService.setMetadata(metadataDto);
  }
}
