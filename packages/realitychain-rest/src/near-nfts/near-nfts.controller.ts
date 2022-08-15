import { Controller, Post, Body } from '@nestjs/common';
import { NearNftsService } from './near-nfts.service';
import {
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
} from '@realitychain/api';
@Controller('parcels')
export class NearNftsController {
  constructor(private readonly nearNftsService: NearNftsService) {}

  @Post('set-metadata')
  async setMetadata(@Body() metadataDto: NftSetSeriesTokenMetadataDto) {
    return await this.nearNftsService.setMetadata(metadataDto);
  }

  @Post('set-parcel-metadata')
  async setParcelMetadata(@Body() parcelDto: NftSetSeriesParcelMetadataDto) {
    return await this.nearNftsService.setParcelMetadata(parcelDto);
  }
}
