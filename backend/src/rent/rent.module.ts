import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RentService, JwtService],
  controllers: [RentController]
})
export class RentModule {}
