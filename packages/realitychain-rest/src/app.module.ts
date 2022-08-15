import { Module } from '@nestjs/common';
import { ParcelsModule } from './parcels/parcels.module';
import { VouchersModule } from './vouchers/vouchers.module';

require('dotenv').config(); // eslint-disable-line

@Module({
  imports: [ParcelsModule, VouchersModule],
})
export class AppModule {}
