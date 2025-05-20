import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, JwtService],
})
export class FinanceModule {}
