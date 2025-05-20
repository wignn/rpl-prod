import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ReportService, JwtService],
  controllers: [ReportController]
})
export class ReportModule {}
