import { Injectable } from '@nestjs/common';
import {
  NftSetSeriesTokenMetadataDto,
  nftSetSeriesMetadata,
  vouchersContractWithAccountId,
} from '@realitychain/api';
import { getVouchersConfig } from '../config';
import { keyStores } from 'near-api-js';

require('dotenv').config(); // eslint-disable-line

@Injectable()
export class VouchersService {
  async setMetadata(metadataDto: NftSetSeriesTokenMetadataDto) {
    const vouchersConfig = getVouchersConfig('development');

    // Initializing our contract APIs by contract name and configuration
    const vouchersContract = await vouchersContractWithAccountId(
      'rc-orang.testnet',
      new keyStores.UnencryptedFileSystemKeyStore(process.env.NEAR_CRED_DIR),
      vouchersConfig,
    );

    return await nftSetSeriesMetadata(vouchersContract, metadataDto);
  }
}
