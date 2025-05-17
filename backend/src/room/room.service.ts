import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validate.service';
import {
  RoomCreateRequest,
  RoomCreateResponse,
  RoomDetailResponse,
  RoomUpdateRequest,
} from 'src/models/room.model';
import { Logger } from 'winston';
import {RoomValidation } from './room.validation';
import { DeleteResponse } from 'src/models/common.model';

@Injectable()
export class RoomService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
  ) {}

  async create(request: RoomCreateRequest): Promise<RoomCreateResponse> {
    this.logger.info(`Creating new room`);
    const roomRequest: RoomCreateRequest = this.validationService.validate(
      RoomValidation.CREATE,
      request,
    );

    // Validasi apakah RoomType ada
    const roomType = await this.prisma.roomType.findUnique({
      where: { id_roomtype: roomRequest.id_roomtype },
    });
    if (!roomType) {
      throw new HttpException('Room Type does not exist', 404);
    }

    const room = await this.prisma.room.create({
      data: {
        id_roomtype: roomRequest.id_roomtype,
        status: roomRequest.status,
        
      },
    });

    return {
      id_room: room.id_room,
      id_roomtype: room.id_roomtype,
      status: room.status,
      created_at: room.created_at,
      updated_at: room.updated_at,
    };
  }

  async findAll(): Promise<RoomDetailResponse[]> {
    this.logger.info(`Finding all rooms`);
    const rooms = await this.prisma.room.findMany({
      where: { deleted: false },
      include: { roomType: true },
    });
    return rooms.map((room) => ({
      id_room: room.id_room,
      id_roomtype: room.id_roomtype,
      status: room.status,
      created_at: room.created_at,
      updated_at: room.updated_at,
      roomtype: {
        id_roomtype: room.roomType.id_roomtype,
        room_type: room.roomType.room_type,
        price: room.roomType.price,
        created_at: room.roomType.created_at,
        updated_at: room.roomType.updated_at,
      },
    }));
  }

  async findOne(id: string): Promise<RoomDetailResponse> {
    this.logger.info(`Finding room with id ${id}`);
    const room = await this.prisma.room.findUnique({
      where: { id_room: id, deleted: false },
      include: { roomType: true },
    });
    if (!room) {
      throw new HttpException('Room not found', 404);
    }
    return {
      id_room: room.id_room,
      id_roomtype: room.id_roomtype,
      status: room.status,
      created_at: room.created_at,
      updated_at: room.updated_at,
      roomtype: {
        id_roomtype: room.roomType.id_roomtype,
        room_type: room.roomType.room_type,
        price: room.roomType.price,
        created_at: room.roomType.created_at,
        updated_at: room.roomType.updated_at,
      },
    };
  }

  async update(
    id: string,
    request: RoomUpdateRequest,
  ): Promise<RoomCreateResponse> {
    this.logger.info(`Updating room with id ${id}`);
    const roomRequest: RoomUpdateRequest = this.validationService.validate(
      RoomValidation.UPDATE,
      request,
    );

    const roomType = await this.prisma.roomType.findUnique({
      where: { id_roomtype: roomRequest.id_roomtype },
    });
    if (!roomType) {
      throw new HttpException('Room Type does not exist', 404);
    }
    const existingRoom = await this.prisma.room.findUnique({
      where: { id_room: id, deleted: false },
    });
    if (!existingRoom) {
      throw new HttpException('Room not found', 404);
    }

    const room = await this.prisma.room.update({
      where: { id_room: id },
      data: roomRequest,
    });

    return {
      id_room: room.id_room,
      id_roomtype: room.id_roomtype,
      status: room.status,
      created_at: room.created_at,
      updated_at: room.updated_at,
    };
  }

  async delete(id: string): Promise<DeleteResponse> {
    this.logger.info(`Deleting room with id ${id}`);

    const room = await this.prisma.room.findUnique({
      where: { id_room: id, deleted: false },
    });
    if (!room) {
      throw new HttpException('Room not found', 404);
    }

    await this.prisma.room.update({
      where: { id_room: id },
      data: { deleted: true },
    });

    return { message: 'Deleted successfully' };
  }

}
