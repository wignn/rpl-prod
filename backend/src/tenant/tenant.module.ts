import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [TenantService, JwtService],
  controllers: [TenantController]
})
export class TenantModule {}
