import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { FasilityService } from './facility.service';
import {
  FacilityCreateRequest,
  FacilityCreateResponse,
  FacilityUpdateRequest,
} from 'src/models/facility.mode';
import { ApiResponse } from '@nestjs/swagger';
import { DeleteResponse } from 'src/models/common.model';

@Controller('api/facility')
export class FasilityController {
  constructor(private readonly facilityService: FasilityService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Facility successfully created',
    type: FacilityCreateResponse,
  })
  async create(
    @Body() request: FacilityCreateRequest,
  ): Promise<FacilityCreateResponse> {
    return this.facilityService.create(request);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get all facilities',
    type: [FacilityCreateResponse],
  })
  async findAll(): Promise<FacilityCreateResponse[]> {
    return this.facilityService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
        status: 200,
        description: 'Get facility by ID',
        type: FacilityCreateResponse,
    })
    async findOne(@Param('id') id: string): Promise<FacilityCreateResponse> {
        return this.facilityService.findOne(id);
    }


    @Put(':id')
    @ApiResponse({
        status: 200,
        description: 'Update facility by ID',
        type: FacilityCreateResponse,
    })
    async update(
        @Param('id') id: string,
        @Body() request: FacilityUpdateRequest,
    ): Promise<FacilityCreateResponse> {
        return this.facilityService.update(id, request);
    }

    @Delete(':id')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Delete facility by ID',
        type: DeleteResponse,
    })
    async delete(
        @Param('id') id: string,
    ): Promise<FacilityCreateResponse> {
        return this.facilityService.delete(id);
    }
}
