import { ApiProperty } from "@nestjs/swagger";
import { REPORTSTATUS } from "@prisma/client";

export class ReportCreateRequest {
    id_tenant: string;
    id_facility: string;
    report_desc: string;
    report_date: Date;
    status: REPORTSTATUS;
}


export class ReportResponse extends ReportCreateRequest {
    id_report: string;
    created_at: Date;
    updated_at: Date;
}
export class ReportDetailResponse extends ReportCreateRequest {
    id_report: string;
    created_at: Date;
    updated_at: Date;
    tenant: {
        id_tenant: string;
        full_name: string;
    };
    facility: {
        id_facility: string;
        facility_name: string;
    };
}
export class ReportUpdateRequest {
    id_tenant?: string;
    id_facility?: string;
    report_desc?: string;
    report_date?: Date;
    status?: REPORTSTATUS;
}

export class ReportDeleteRequest {
    id_report: string;
}

export class ReportAllResponse extends ReportCreateRequest {
  @ApiProperty({ example: '1234-5678-9101' })
  id_report: string;

  @ApiProperty({ example: '2025-04-01T12:00:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2025-04-02T12:00:00Z' })
  updated_at: Date;

  @ApiProperty({ example: 10 })
  count: number;
  
  @ApiProperty({
    example: {
      id_tenant: 'tenant-001',
      full_name: 'John Doe',
    },
  })
  tenant: {
    id_tenant: string;
    full_name: string;
  };

  @ApiProperty({
    example: {
      id_facility: 'facility-001',
      facility_name: 'Main Building',
    },
  })
  facility: {
    id_facility: string;
    facility_name: string;
  };
}

export class PaginatedReportResponse {
    @ApiProperty({ type: [ReportAllResponse] })
    data: ReportAllResponse[];
  
    @ApiProperty({ example: 1 })
    currentPage: number;
  
    @ApiProperty({ example: 5 })
    totalPages: number;
  
    @ApiProperty({ example: 50 })
    totalItems: number;

  }