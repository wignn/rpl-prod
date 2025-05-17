
export enum Status {
    MARRIED = "MARRIED",
    SINGLE = "SINGLE",
  }
  
  export interface Room {
    id_room: string;
    room_name: string;
    rent_in: string | null;
    rent_out: string | null;
    status: "AVAILABLE" | "NOTAVAILABLE";
  }
  export interface Rent {
    id_rent: string | null;
    id_tenant: string | null;
    id_room: string | null;
    rent_date: string | null;
    rent_out: string | null;
  }
  
  export interface TenantWithRentAndRoom {
    id_tenant: string;
    address: string;
    no_ktp: string;
    status: Status;
    no_telp: string;
    full_name: string;
    rent: Rent;
    room: Room | null;
  }
    export interface TenantCreateRequest {
    no_ktp: string;
    full_name: string;
    address: string;
    status: Status;
    rent_in: string;
    no_telp: string;
    id_room: string;
  }
  
  export interface TenantUserResponse {
    id_user: string;
    name: string;
    role: string;
  }
  
  export interface TenantResponse {
    id_tenant: string;
    address: string;
    no_ktp: string;
    status: Status;
    no_telp: string;
    full_name: string;
  }
  
  export interface TenantRoomResponse {
    id_rent: string;
    id_tenant: string | null;
    id_room: string;
    rent_date: string; 
  }
  
  export interface TenantCreateResponse {
    user: TenantUserResponse;
    tenant: TenantResponse;
    roomData: TenantRoomResponse;
  }
  