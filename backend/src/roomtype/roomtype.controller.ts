import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { DeleteResponse } from 'src/models/common.model';
import { RoomResponse, RoomTypeCreateRequest, RoomTypeResponse } from 'src/models/room.model';
import { RoomtypeService } from './roomtype.service';

@Controller('api/roomtype')
export class RoomtypeController {
    constructor(
        private readonly roomtypeService: RoomtypeService,
     ) { }


  //get all room types
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'RoomType successfully found',
    type: RoomResponse,
  })
  async findAllRoomTypes(): Promise<RoomTypeResponse[]> {
    return this.roomtypeService.findAllRoomType();
  }

  //get room type by id
  @Get(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'RoomType successfully found',
    type: RoomResponse,
  })
  async findOneRoomType(@Param('id') id: string): Promise<RoomTypeResponse> {
    return this.roomtypeService.findOneRoomType(id);
  }


  //create room type
  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'RoomType created successfully',
    type: RoomTypeResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async createRoomType(
    @Body() request: RoomTypeCreateRequest,
  ): Promise<RoomTypeResponse> {
    return this.roomtypeService.createRoomType(request);
  }
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'RoomType updated successfully',
    type: RoomTypeResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 404,
    description: 'RoomType not exist',
  })
  @HttpCode(200)
  async updateRoomType(
    @Param('id') id: string,
    @Body() request: RoomTypeCreateRequest,
  ): Promise<RoomTypeResponse> {
    return this.roomtypeService.updateRoomType(id, request);
  }

  //delete room type
  @Delete(':id')    
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'RoomType successfully deleted',
    type: DeleteResponse,
  })
  async deleteRoomType(@Param('id') id: string): Promise<DeleteResponse> {
    return this.roomtypeService.deleteRoomType(id);
  }
}
