import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validate.service';
import {
    FacilityUpdateRequest,
  FacilityCreateRequest,
  FacilityCreateResponse,
} from 'src/models/facility.mode';
import { Logger } from 'winston';
import { FasilityValidation } from './facility.validation';

@Injectable()
export class FasilityService {
  constructor(
    private validationService: ValidationService,
    private readonly prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    request: FacilityCreateRequest,
  ): Promise<FacilityCreateResponse> {
    this.logger.info(`Creating new fasility`);

    const fasilityRequest: FacilityCreateRequest =
      this.validationService.validate(FasilityValidation.CREATE, request);

    const facility = await this.prismaService.facility.create({
      data: fasilityRequest,
    });

    return {
      id_fasility: facility.id_facility,
      facility_name: facility.facility_name,
      desc: facility.desc,
      created_at: facility.created_at,
      updated_at: facility.updated_at,
    };
  }

  async findAll(): Promise<FacilityCreateResponse[]> {
    this.logger.info(`Finding all fasility`);
    const fasility = await this.prismaService.facility.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {},
    });

    return fasility.map((item) => ({
      id_fasility: item.id_facility,
      facility_name: item.facility_name,
      desc: item.desc,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }

  async findOne(id: string): Promise<FacilityCreateResponse> {
    this.logger.info(`Finding fasility with id ${id}`);

    const fasility = await this.prismaService.facility.findUnique({
      where: {
        id_facility: id,
      },
    });

    if (!fasility) {
      throw new Error('Fasility not found');
    }

    return {
      id_fasility: fasility.id_facility,
      facility_name: fasility.facility_name,
      desc: fasility.desc,
      created_at: fasility.created_at,
      updated_at: fasility.updated_at,
    };
  }

  async update(
    id: string,
    request: FacilityUpdateRequest,
  ): Promise<FacilityCreateResponse> {
    this.logger.info(`Updating fasility with id ${id}`);

    const fasilityRequest: FacilityUpdateRequest =
      this.validationService.validate(FasilityValidation.UPDATE, request);

    const facility = await this.prismaService.facility.update({
      where: {
        id_facility: id,
      },
      data: fasilityRequest,
    });

    return {
      id_fasility: facility.id_facility,
      facility_name: facility.facility_name,
      desc: facility.desc,
      created_at: facility.created_at,
      updated_at: facility.updated_at,
    };
  }

  async delete(id: string): Promise<FacilityCreateResponse> {
    this.logger.info(`Deleting fasility with id ${id}`);

    const fasility = await this.prismaService.facility.findUnique({
      where: {
        id_facility: id,
      },
    });
    if (!fasility) {
      throw new Error('Fasility not found');
    }

    await this.prismaService.facility.update({
      where: {
        id_facility: id,
      },
      data: {
        deleted: true,
      },
    });

    return {
      id_fasility: fasility.id_facility,
      facility_name: fasility.facility_name,
      desc: fasility.desc,
      created_at: fasility.created_at,
      updated_at: fasility.updated_at,
    };
  }
}
