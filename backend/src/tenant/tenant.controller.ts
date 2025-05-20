import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import {
  TenantCreateRequest,
  TenantCreateResponse,
  TenantUpdateRequest,
} from 'src/models/tenant.model';
import { ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('api/tenant')
export class TenantController {
  constructor(private tenantservice: TenantService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Tenant created successfully',
    type: TenantCreateResponse,
  })
  async create(
    @Body() request: TenantCreateRequest,
  ): Promise<TenantCreateResponse> {
    return this.tenantservice.create(request);
  }

  @UseGuards(JwtGuard)
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Tenant retrieved successfully',
    type: TenantCreateResponse,
  })
  async findAll(): Promise<any> {
    return this.tenantservice.findAll();
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Tenant updated successfully',
    type: TenantUpdateRequest,
  })
  async update(
    @Param('id') id: string,
    @Body() request: TenantUpdateRequest,
  ): Promise<any> {
    return this.tenantservice.update(id, request);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Tenant deleted successfully',
  })
  async delete(@Param('id') id: string): Promise<any> {
    return this.tenantservice.delete(id);
  }

  @UseGuards(JwtGuard)
  @Get('record')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Tenant rent record retrieved successfully',
  })
  async recordRent() {
    return this.tenantservice.recordRent();
  }
}
