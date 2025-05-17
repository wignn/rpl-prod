import { ApiProperty } from "@nestjs/swagger";
import { ROLE, STATUS } from "@prisma/client";

export class TenantCreateRequest {
    @ApiProperty({
        example: '2311400000000004',
        description: 'KTP number of the tenant',
        required: true,
    })
    no_ktp: string;

    @ApiProperty({
        example: 'M. Iqbal',
        description: 'Full name of the tenant',
        required: true,
    })
    full_name: string;

    @ApiProperty({
        example: 'Jl. Kaliurang No. 10',
        description: 'Address of the tenant',
        required: true,
    })
    address: string;

    @ApiProperty({
        example: 'MARRIED',
        description: 'Marital status of the tenant',
        required: true,
    })
    status: STATUS;

    @ApiProperty({
        example: '2021-08-22',
        description: 'Date when the tenant moved in',
        required: true,
    })
    rent_in: string;

    @ApiProperty({
        example: '08123456789',
        description: 'Phone number of the tenant',
        required: true,
    })
    no_telp: string;

    @ApiProperty({
        example: 'R001',
        description: 'Room ID assigned to the tenant',
        required: true,
    })
    id_room: string;
}

class TenantUserResponse {
    @ApiProperty({ example: '1' })
    id_user: string;

    @ApiProperty({ example: "M. Iqbal" })
    name: string;

    @ApiProperty({ example: "TENANT" })
    role: ROLE;
}

class TenantResponse {
    @ApiProperty({ example: '1' })
    id_tenant: string;

    @ApiProperty({ example: "Jl. Kaliurang No. 10" })
    address: string;

    @ApiProperty({ example: "2311400000000004" })
    no_ktp: string;

    @ApiProperty({ example: "MARRIED" })
    status: STATUS;

    @ApiProperty({ example: "08123456789" })
    no_telp: string;

    @ApiProperty({ example: "M. Iqbal" })
    full_name: string;
}

class TenantRoomResponse {
    @ApiProperty({ example: '1' })
    id_rent: string;

    @ApiProperty({ example: '1', nullable: true })
    id_tenant: string | null;

    @ApiProperty({ example: "R001" })
    id_room: string;

    @ApiProperty({ example: "2021-08-22" })
    rent_date: Date;
}

export class TenantUpdateRequest {
    @ApiProperty({
        example: 'Jl. Kaliurang No. 10',
        description: 'Address of the tenant',
        required: false,
    })
    address?: string;
    @ApiProperty({
        example: '2311400000000004',
        description: 'KTP number of the tenant',
        required: false,
    })
    no_ktp?: string;
    @ApiProperty({
        example: 'MARRIED',
        description: 'Marital status of the tenant',
        required: false,
    })
    status?: STATUS;
    @ApiProperty({
        example: '08123456789',
        description: 'Phone number of the tenant',
        required: false,
    })
    no_telp?: string;
    @ApiProperty({
        example: 'R001',
        description: 'Room ID assigned to the tenant',
        required: false,
    })
    id_room?: string;
    @ApiProperty({
        example: '2021-08-22',
        description: 'Date when the tenant moved in',
        required: false,
    })
    rent_in?: string;
    @ApiProperty({
        example: 'M. Iqbal',
        description: 'Full name of the tenant',
        required: false,
    })
    full_name?: string;
}

export class TenantCreateResponse {
    @ApiProperty({ type: TenantUserResponse })
    user: TenantUserResponse;

    @ApiProperty({ type: TenantResponse })
    tenant: TenantResponse;

    @ApiProperty({ type: TenantRoomResponse })
    roomData: TenantRoomResponse;
}
