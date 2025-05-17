import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validate.service';
import { DeleteResponse } from 'src/models/common.model';
import {
  RoomTypeCreateRequest,
  RoomTypeDetailsResponse,
  RoomTypeResponse,
  RoomTypeUpdateRequest,
} from 'src/models/room.model';
import { RoomtypeValidation } from 'src/room/room.validation';
import { Logger } from 'winston';

@Injectable()
export class RoomtypeService {
  constructor(
    private readonly validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  async createRoomType(
    request: RoomTypeCreateRequest,
  ): Promise<RoomTypeResponse> {
    this.logger.info(`Creating new room type`);
    this.logger.info(request);
    const roomRequest: RoomTypeCreateRequest = this.validationService.validate(
      RoomtypeValidation.CREATE,
      request,
    );
    const r = await this.prisma.roomType.count({
      where: { room_type: roomRequest.room_type, deleted: false },
    });

    const roomType = await this.prisma.roomType.create({
      data: {
        room_type: roomRequest.room_type,
        price: roomRequest.price,
        image: roomRequest.image,
        facilities: {
          connect: roomRequest.facilities.map((f) => ({ id_facility: f })),
        },
      },
    });
    

    return {
      id_roomtype: roomType.id_roomtype,
      room_type: roomType.room_type,
      price: roomType.price,
      created_at: roomType.created_at,
      updated_at: roomType.updated_at,
    };
  }

  async findAllRoomType(): Promise<RoomTypeDetailsResponse[]> {
    this.logger.info(`Finding all room types`);
    const roomTypes = await this.prisma.roomType.findMany({
      where: { deleted: false },
      include: { facilities: true },
    });

    return roomTypes.map((roomType) => ({
      id_roomtype: roomType.id_roomtype,
      room_type: roomType.room_type,
      price: roomType.price,
      created_at: roomType.created_at,
      updated_at: roomType.updated_at,
      image: roomType.image ?? undefined,
      facility: roomType.facilities?.map((f) => ({
        id_facility: f.id_facility,          
        facility_name: f.facility_name,
        created_at: f.created_at,
        updated_at: f.updated_at,
      })) ?? []
    }));
    
  }

  async findOneRoomType(id: string): Promise<RoomTypeDetailsResponse> {
    this.logger.info(`Finding room type with id ${id}`);
    const roomType = await this.prisma.roomType.findUnique({
      where: { id_roomtype: id, deleted: false },
      include: { facilities: true },
    });
    if (!roomType) {
      throw new HttpException('Room Type not found', 404);
    }
    return {
      id_roomtype: roomType.id_roomtype,
      room_type: roomType.room_type,
      price: roomType.price,
      image: roomType.image ?? undefined,
      created_at: roomType.created_at,
      updated_at: roomType.updated_at,
      facility: roomType.facilities?.map((f) => ({
        id_facility: f.id_facility,
        facility_name: f.facility_name,
        created_at: f.created_at,
        updated_at: f.updated_at,
      })) ?? [],
    };
  }
  async updateRoomType(
    id: string,
    request: RoomTypeUpdateRequest,
  ): Promise<RoomTypeResponse> {
    this.logger.info(`Updating room type with id ${id}`);
    const roomRequest: RoomTypeUpdateRequest = this.validationService.validate(
      RoomtypeValidation.UPDATE,
      request,
    );
  
    const existingRoomType = await this.prisma.roomType.count({
      where: { id_roomtype: id, deleted: false },
    });
    if (existingRoomType === 0) {
      throw new HttpException('Room Type not found', 404);
    }
  
    const roomType = await this.prisma.roomType.update({
      where: { id_roomtype: id },
      data: {
        room_type: roomRequest.room_type,
        price: roomRequest.price,
        image: roomRequest.image,
        facilities: {
          set: [], 
          connect: roomRequest.facilities.map((f) => ({ id_facility: f })),
        },
      },
    });
  
    return {
      id_roomtype: roomType.id_roomtype,
      room_type: roomType.room_type,
      price: roomType.price,
      created_at: roomType.created_at,
      updated_at: roomType.updated_at,
    };
  }
  
  async deleteRoomType(id: string): Promise<DeleteResponse> {
    this.logger.info(`Deleting room type with id ${id}`);

    const roomType = await this.prisma.roomType.findUnique({
      where: { id_roomtype: id, deleted: false },
    });
    if (!roomType) {
      throw new HttpException('Room Type not found', 404);
    }

    await this.prisma.roomType.update({
      where: { id_roomtype: id },
      data: { deleted: true },
    });

    return { message: 'Deleted successfully' };
  }
}
