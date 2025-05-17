import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import {
  RoomCreateRequest,
  RoomCreateResponse,
  RoomResponse,
  RoomDetailResponse,
  RoomTypeResponse,
  RoomTypeCreateRequest,
} from 'src/models/room.model';
import { ApiResponse } from '@nestjs/swagger';
import { DeleteResponse } from 'src/models/common.model';

@Controller('api/room')
export class RoomController {
  constructor(private roomservice: RoomService) {}

  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Room created successfully',
    type: RoomCreateResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'RoomType not exist',
  })
  async createRoom(
    @Body() request: RoomCreateRequest,
  ): Promise<RoomCreateResponse> {
    return this.roomservice.create(request);
  }

  @ApiResponse({
    status: 200,
    description: 'Room successfully found',
    type: RoomResponse,
  })
  @Get()
  @HttpCode(200)
  async findAll(): Promise<RoomDetailResponse[]> {
    return this.roomservice.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Room successfully found',
    type: RoomResponse,
  })
  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<RoomDetailResponse> {
    return this.roomservice.findOne(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Room successfully deleted',
    type: DeleteResponse,
  })
  @Delete(':id')
  @HttpCode(200)
  async delete(@Param('id') id: string): Promise<DeleteResponse> {
    return this.roomservice.delete(id);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'Room successfully updated',
    type: RoomCreateResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() request: RoomCreateRequest,
  ): Promise<RoomCreateResponse> {
    return this.roomservice.update(id, request);
  }
}
