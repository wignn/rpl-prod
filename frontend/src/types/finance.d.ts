
export class FinanceCreateRequest {
    id_tenant?: string;
    id_rent?: string;
    type: INOUT;
    category: string;
    amount: number;
    payment_date: Date;
}


export enum INOUT {
    INCOME = "INCOME",
    OUTCOME = "OUTCOME",
}


class TenantDetails {
    id_tenant: string;
    name: string;
}

class RentDetails {
    id_rent: string;
    id_room: string;
    rent_date: Date;
}
export class FinanceDetailsResponse {
    id_finance: string;
    id_tenant: string;
    id_rent: string;
    type: INOUT;
    category: string;
    amount: number;
    payment_date: Date;
    created_at: Date;
    updated_at: Date;
    tenant: TenantDetails;
    rentData: RentDetails;
}
