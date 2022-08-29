import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ParcelsService } from './parcels.service';
import {
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
} from '@realitychain/api';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('set-metadata')
  async setMetadata(@Body() metadataDto: NftSetSeriesTokenMetadataDto) {
    return await this.parcelsService.setMetadata(metadataDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-parcel-metadata')
  async setParcelMetadata(@Body() parcelDto: NftSetSeriesParcelMetadataDto) {
    return await this.parcelsService.setParcelMetadata(parcelDto);
  }
}
