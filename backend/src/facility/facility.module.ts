import { Module } from '@nestjs/common';
import { FasilityController } from './facility.controller';
import { FasilityService } from './facility.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FasilityController],
  providers: [FasilityService, JwtService]
})
export class FasilityModule {}
