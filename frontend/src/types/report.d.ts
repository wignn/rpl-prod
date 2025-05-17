
export class ReportCreateRequest {
    id_tenant: string;
    id_facility: string;
    report_desc: string;
    report_date: Date;
    status: REPORTSTATUS;
}
enum REPORTSTATUS {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
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
    id_report: string;
    created_at: Date;
    updated_at: Date;
    count: number;
    tenant: {
      id_tenant: string;
      full_name: string;
    };
    facility: {
      id_facility: string;
      facility_name: string;
    };
  }

export class PaginatedReportResponse {
    data: ReportAllResponse[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }