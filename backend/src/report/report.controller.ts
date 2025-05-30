import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportCreateRequest, ReportResponse,ReportDetailResponse, PaginatedReportResponse } from 'src/models/report.model';
import { ApiResponse } from '@nestjs/swagger';
import { DeleteResponse } from 'src/models/common.model';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Report successfully created',
    type: ReportResponse,
  })
  async create(@Body() request: ReportCreateRequest): Promise<ReportResponse> {
    return this.reportService.create(request);
  }

  
  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all reports with pagination',
    type: PaginatedReportResponse,
  })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('month') month: string = new Date().toLocaleString('default', { month: 'long' }),
    @Query('search') search: string = '',
  ): Promise<PaginatedReportResponse> {
    return this.reportService.findAll(parseInt(page), parseInt(limit), month, search);
  }
  
  
  @UseGuards(JwtGuard)
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get report by ID',
    type: ReportResponse,
  })
  async findOne(@Param('id') id: string): Promise<ReportDetailResponse> {
    return this.reportService.findOne(id);
  }

  
  @UseGuards(JwtGuard)
  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Update report by ID',
    type: ReportResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() request: ReportCreateRequest,
  ): Promise<ReportResponse> {
    return this.reportService.update(id, request);
  }

  
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Delete report by ID',
    type: DeleteResponse,
  })
  async delete(@Param('id') id: string): Promise<DeleteResponse> {
    return this.reportService.delete(id);
  }
}
