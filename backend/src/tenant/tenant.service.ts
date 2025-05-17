import { ValidationService } from 'src/common/validate.service';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  TenantCreateRequest,
  TenantCreateResponse,
  TenantUpdateRequest,
} from 'src/models/tenant.model';
import { TenantValidation } from './tenat.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async create(request: TenantCreateRequest): Promise<TenantCreateResponse> {
    this.logger.info(`Creating new tenant`);

    const tenantRequest: TenantCreateRequest = this.validationService.validate(
      TenantValidation.CREATE,
      request,
    );

    const isUserExist = await this.prismaService.user.count({
      where: { phone: tenantRequest.no_telp },
    });

    if (isUserExist > 0) {
      throw new HttpException('User already exists', 400);
    }

    const u = await this.prismaService.room.findUnique({
      where: { id_room: tenantRequest.id_room },
      include: {
        roomType: {
          include: {
            facilities: true,
          },
        },
      },
    });

    const hashPassword = await bcrypt.hash(tenantRequest.no_telp, 10);

    const user = await this.prismaService.user.create({
      data: {
        phone: tenantRequest.no_telp,
        name: tenantRequest.full_name,
        password: hashPassword,
        role: 'TENANT',
      },
    });

    const tenant = await this.prismaService.tenant.create({
      data: {
        jatuh_tempo: tenantRequest.rent_in,
        tagihan: u?.roomType?.price ?? 0,
        userId: user.id_user,
        address: tenantRequest.address,
        no_ktp: tenantRequest.no_ktp,
        status: tenantRequest.status,
        no_telp: tenantRequest.no_telp,
        full_name: tenantRequest.full_name,
      },
    });

    const roomData = await this.prismaService.rentData.create({
      data: {
        tenantId: tenant.id_tenant,
        roomId: tenantRequest.id_room,
        rent_date: tenantRequest.rent_in,
      },
    });

    // Handle RoomFacility creation for all facilities in RoomType
    if (u?.roomType?.facilities?.length) {
      for (const facility of u.roomType.facilities) {
        const exists = await this.prismaService.roomFacility.findUnique({
          where: {
            id_room_id_facility: {
              id_room: tenantRequest.id_room,
              id_facility: facility.id_facility,
            },
          },
        });

        if (!exists) {
          await this.prismaService.roomFacility.create({
            data: {
              id_room: tenantRequest.id_room,
              id_facility: facility.id_facility,
            },
          });
        }
      }
    }

    await this.prismaService.room.update({
      where: { id_room: tenantRequest.id_room },
      data: { status: 'NOTAVAILABLE' },
    });

    return {
      user: {
        id_user: user.id_user,
        name: user.name,
        role: user.role,
      },
      tenant: {
        id_tenant: tenant.id_tenant,
        address: tenant.address,
        no_ktp: tenant.no_ktp,
        status: tenant.status,
        no_telp: tenant.no_telp,
        full_name: tenant.full_name,
      },
      roomData: {
        id_rent: roomData.id_rent,
        id_tenant: roomData.tenantId,
        id_room: roomData.roomId,
        rent_date: roomData.rent_date,
      },
    };
  }

  async findAll(): Promise<any> {
    this.logger.info('Fetching all tenants');

    const data = await this.prismaService.tenant.findMany({
      where: {
        deleted: false,
        user: {
          role: 'TENANT',
        },
      },
      include: {
        user: true,
        rentData: {
          include: {
            room: {
              include: {
                roomType: true,
              },
            },
          },
        },
      },
    });

    return data.map((tenant) => ({
      id_tenant: tenant.id_tenant,
      address: tenant.address,
      no_ktp: tenant.no_ktp,
      status: tenant.status,
      no_telp: tenant.no_telp,
      full_name: tenant.full_name,
      rent: {
        id_rent: tenant.rentData?.id_rent ?? null,
        id_tenant: tenant.rentData?.tenantId ?? null,
        id_room: tenant.rentData?.roomId ?? null,
        rent_date: tenant.rentData?.rent_date ?? null,
        rent_out: tenant.rentData?.rent_out ?? null,
      },
      room: tenant.rentData
        ? {
            id_room: tenant.rentData.roomId,
            room_name: tenant.rentData.room?.roomType?.room_type ?? null,
            rent_in: tenant.rentData.rent_date,
            rent_out: tenant.rentData.rent_out,
            status: tenant.rentData.room?.status ?? null,
          }
        : null,
    }));
  }


  
async update(
  id: string,
  request: TenantUpdateRequest,
): Promise<TenantCreateResponse> {
  this.logger.info(`Updating tenant`);

  const tenantRequest: TenantCreateRequest = this.validationService.validate(
    TenantValidation.UPDATE,
    request,
  );

  const existingTenant = await this.prismaService.tenant.findUnique({
    where: { id_tenant: id },
    include: { rentData: true }, 
  });

  if (!existingTenant) {
    throw new HttpException('Tenant not found', 404);
  }

  const updatedTenant = await this.prismaService.tenant.update({
    where: { id_tenant: id },
    data: {
      address: tenantRequest.address,
      no_ktp: tenantRequest.no_ktp,
      status: tenantRequest.status,
      no_telp: tenantRequest.no_telp,
      full_name: tenantRequest.full_name,
    },
    include: {
      user: true,
    },
  });

  let updatedRentData: any = null;

  if (existingTenant.rentData) {
    const currentRoomId = existingTenant.rentData.roomId;

    if (tenantRequest.id_room && tenantRequest.id_room !== currentRoomId) {
      await this.prismaService.room.update({
        where: { id_room: currentRoomId },
        data: { status: 'AVAILABLE' },
      });

      const newRoom = await this.prismaService.room.findUnique({
        where: { id_room: tenantRequest.id_room },
      });

      if (!newRoom) {
        throw new HttpException('New room not found', 404);
      }

      await this.prismaService.room.update({
        where: { id_room: tenantRequest.id_room },
        data: { status: 'NOTAVAILABLE' },
      });
    }

    // Update rentData
    updatedRentData = await this.prismaService.rentData.update({
      where: { id_rent: existingTenant.rentData.id_rent },
      data: {
        tenantId: updatedTenant.id_tenant,
        roomId: tenantRequest.id_room ?? currentRoomId,
        rent_date: tenantRequest.rent_in ?? existingTenant.rentData.rent_date,
      },
    });
  }

  return {
    user: {
      id_user: updatedTenant.user.id_user,
      name: updatedTenant.user.name,
      role: updatedTenant.user.role,
    },
    tenant: {
      id_tenant: updatedTenant.id_tenant,
      address: updatedTenant.address,
      no_ktp: updatedTenant.no_ktp,
      status: updatedTenant.status,
      no_telp: updatedTenant.no_telp,
      full_name: updatedTenant.full_name,
    },
    roomData: updatedRentData
      ? {
          id_rent: updatedRentData.id_rent,
          id_tenant: updatedRentData.tenantId,
          id_room: updatedRentData.roomId,
          rent_date: updatedRentData.rent_date,
        }
      : {
          id_rent: '',
          id_tenant: '',
          id_room: '',
          rent_date: new Date(),
        },
  };
}


  async delete(id: string): Promise<any> {
    this.logger.info(`Deleting tenant`);

    const tenant = await this.prismaService.tenant.findUnique({
      where: { id_tenant: id },
      include: {
        rentData: {
          include: {
            room: true,
          },
        },
      }
    }
  );

    await this.prismaService.room.update({
      where: { id_room: tenant?.rentData?.roomId },
      data: { status: 'AVAILABLE' },
    })

    if (!tenant) {
      throw new HttpException('Tenant not found', 404);
    }

    await this.prismaService.tenant.update({
      where: { id_tenant: id },
      data: { deleted: true },
    });

    return { message: 'Tenant deleted successfully' };
  }
}
