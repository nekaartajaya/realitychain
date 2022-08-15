import { Controller, Post, Body } from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import {
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
} from '@realitychain/api';
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Post('set-metadata')
  async setMetadata(@Body() metadataDto: NftSetSeriesTokenMetadataDto) {
    return await this.parcelsService.setMetadata(metadataDto);
  }

  @Post('set-parcel-metadata')
  async setParcelMetadata(@Body() parcelDto: NftSetSeriesParcelMetadataDto) {
    return await this.parcelsService.setParcelMetadata(parcelDto);
  }
}
