import { Injectable } from '@nestjs/common';
import {
  NftSetSeriesParcelMetadataDto,
  NftSetSeriesTokenMetadataDto,
  nftSetSeriesParcelMetadata,
  nftSetSeriesMetadata,
  parcelsContractWithAccountId,
} from '@realitychain/api';
import { getParcelsConfig } from '../config';
import { keyStores } from 'near-api-js';

require('dotenv').config(); // eslint-disable-line

@Injectable()
export class ParcelsService {
  async setMetadata(metadataDto: NftSetSeriesTokenMetadataDto) {
    const parcelsConfig = getParcelsConfig('development');

    // Initializing our contract APIs by contract name and configuration
    const parcelsContract = await parcelsContractWithAccountId(
      'rc-orang.testnet',
      new keyStores.UnencryptedFileSystemKeyStore(process.env.NEAR_CRED_DIR),
      parcelsConfig,
    );

    return await nftSetSeriesMetadata(parcelsContract, metadataDto);
  }

  async setParcelMetadata(parcelDto: NftSetSeriesParcelMetadataDto) {
    const parcelsConfig = getParcelsConfig('development');

    // Initializing our contract APIs by contract name and configuration
    const parcelsContract = await parcelsContractWithAccountId(
      'rc-orang.testnet',
      new keyStores.UnencryptedFileSystemKeyStore(process.env.NEAR_CRED_DIR),
      parcelsConfig,
    );

    return await nftSetSeriesParcelMetadata(parcelsContract, parcelDto);
  }
}
