import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { TenantService } from './tenant.service';
import {
  TenantCreateRequest,
  TenantCreateResponse,
  TenantUpdateRequest,
} from 'src/models/tenant.model';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/tenant')
export class TenantController {
  constructor(private tenantservice: TenantService) {}

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

  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Tenant deleted successfully',
  })
  async delete(@Param('id') id: string): Promise<any> {
    return this.tenantservice.delete(id);
  }

}
