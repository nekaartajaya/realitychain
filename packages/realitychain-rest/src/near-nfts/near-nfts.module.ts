import { Module } from '@nestjs/common';
import { NearNftsService } from './near-nfts.service';
import { NearNftsController } from './near-nfts.controller';

@Module({
  controllers: [NearNftsController],
  providers: [NearNftsService],
})
export class NearNftsModule {}
