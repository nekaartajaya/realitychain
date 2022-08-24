import { Module } from '@nestjs/common';
import { ParcelsModule } from './parcels/parcels.module';

require('dotenv').config(); // eslint-disable-line

@Module({
  imports: [ParcelsModule],
})
export class AppModule {}
