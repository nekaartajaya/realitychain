import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ParcelsModule } from './parcels/parcels.module';

require('dotenv').config(); // eslint-disable-line

@Module({
  imports: [ParcelsModule, AuthModule],
})
export class AppModule {}
