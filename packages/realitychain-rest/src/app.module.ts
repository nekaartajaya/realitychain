import { Module } from '@nestjs/common';
import { NearNftsModule } from './near-nfts/near-nfts.module';

require('dotenv').config(); // eslint-disable-line

@Module({
  imports: [NearNftsModule],
})
export class AppModule {}
