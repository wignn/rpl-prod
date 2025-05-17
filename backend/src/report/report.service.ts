import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validate.service';
import {
  PaginatedReportResponse,
  ReportAllResponse,
  ReportCreateRequest,
  ReportDetailResponse,
  ReportResponse,
  ReportUpdateRequest,
} from 'src/models/report.model';
import { ReportValidation } from './report.validation';
import { Logger } from 'winston';
import { DeleteResponse } from 'src/models/common.model';

@Injectable()
export class ReportService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(request: ReportCreateRequest): Promise<ReportResponse> {
    this.logger.info(`Creating report`);
    const ReportCreateRequest: ReportCreateRequest =
      this.validationService.validate(ReportValidation.CREATE, request);

    const isFacilityExists = await this.prismaService.facility.count({
      where: {
        id_facility: ReportCreateRequest.id_facility,
      },
    });
    const isTenantExists = await this.prismaService.tenant.count({
      where: {
        id_tenant: ReportCreateRequest.id_tenant,
      },
    });

    if (isFacilityExists === 0) {
      throw new Error('Facility not found');
    }
    if (isTenantExists === 0) {
      throw new Error('Tenant not found');
    }

    const report = await this.prismaService.report.create({
      data: ReportCreateRequest,
    });

    this.logger.info(`Report created with ID: ${report.id_report}`);
    this.logger.info(`Report data: ${JSON.stringify(report)}`);
    return {
      id_report: report.id_report,
      id_tenant: report.id_tenant,
      id_facility: report.id_facility,
      report_desc: report.report_desc,
      report_date: report.report_date,
      status: report.status,
      created_at: report.created_at,
      updated_at: report.updated_at,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    month: string = 'semua',
    query?: string | null,
  ): Promise<PaginatedReportResponse> {
    this.logger.info(
      `Fetching reports - Page: ${page}, Limit: ${limit}, Month: ${month}, Query: ${query}`,
    );

    const offset = (page - 1) * limit;

    const monthMap: Record<string, number> = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
    

    let monthFilter = {};

    if (month.toLowerCase() !== 'semua') {
      const monthNumber = monthMap[month.toLowerCase()];
      if (!monthNumber) {
        throw new Error(`Invalid month name: ${month}`);
      }

      const currentYear = new Date().getFullYear();
      const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
      const nextYear = monthNumber === 12 ? currentYear + 1 : currentYear;

      monthFilter = {
        created_at: {
          gte: new Date(
            `${currentYear}-${monthNumber.toString().padStart(2, '0')}-01T00:00:00.000Z`,
          ),
          lt: new Date(
            `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`,
          ),
        },
      };
    }

    const whereClause = {
      deleted: false,
      ...monthFilter,
      ...(query
        ? {
            OR: [
              {
                report_desc: {
                  contains: query,
                  mode: 'insensitive' as const,
                },
              },
              {
                tenant: {
                  is: {
                    full_name: {
                      contains: query,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const totalItems = await this.prismaService.report.count({
      where: whereClause,
    });

    const reports = await this.prismaService.report.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      skip: offset,
      take: limit,
      include: {
        tenant: { select: { id_tenant: true, full_name: true } },
        facility: { select: { id_facility: true, facility_name: true } },
      },
    });

    const reportsWithIndex = reports.map((report, index) => ({
      ...report,
      count: offset + index + 1,
    }));

    return {
      data: reportsWithIndex,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems: totalItems,
    };
  }

  async findOne(id: string): Promise<ReportDetailResponse> {
    this.logger.info(`Finding report with id ${id}`);
    const report = await this.prismaService.report.findUnique({
      where: {
        id_report: id,
      },
      include: {
        tenant: {
          select: {
            id_tenant: true,
            full_name: true,
          },
        },
        facility: {
          select: {
            id_facility: true,
            facility_name: true,
          },
        },
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    return {
      id_report: report.id_report,
      id_tenant: report.id_tenant,
      id_facility: report.id_facility,
      report_desc: report.report_desc,
      report_date: report.report_date,
      status: report.status,
      tenant: {
        id_tenant: report.tenant.id_tenant,
        full_name: report.tenant.full_name,
      },
      facility: {
        id_facility: report.facility.id_facility,
        facility_name: report.facility.facility_name,
      },
      created_at: report.created_at,
      updated_at: report.updated_at,
    };
  }

  async update(
    id: string,
    request: ReportUpdateRequest,
  ): Promise<ReportResponse> {
    this.logger.info(
      `Updating report with id ${id}, data: ${JSON.stringify(request)}`,
    );
    const ReportUpdateRequest: ReportUpdateRequest =
      this.validationService.validate(ReportValidation.UPDATE, request);
    const report = await this.prismaService.report.findUnique({
      where: {
        id_report: id,
        AND: {
          deleted: false,
        },
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    const updatedReport = await this.prismaService.report.update({
      where: {
        id_report: id,
      },
      data: ReportUpdateRequest,
    });

    return {
      id_report: updatedReport.id_report,
      id_tenant: updatedReport.id_tenant,
      id_facility: updatedReport.id_facility,
      report_desc: updatedReport.report_desc,
      report_date: updatedReport.report_date,
      status: updatedReport.status,
      created_at: updatedReport.created_at,
      updated_at: updatedReport.updated_at,
    };
  }

  async delete(id: string): Promise<DeleteResponse> {
    this.logger.info(`Deleting report with id ${id}`);
    const report = await this.prismaService.report.findUnique({
      where: {
        id_report: id,
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    await this.prismaService.report.update({
      where: {
        id_report: id,
      },
      data: {
        deleted: true,
      },
    });

    return { message: 'delete success' };
  }
}
