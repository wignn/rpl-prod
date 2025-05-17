

export class RoomTypeCreateRequest {
    room_type: string;
    price: number;
}

export class RoomTypeUpdateRequest {
    room_type?: string;
    price?: number;
}

export class RoomTypeResponse {
    id_roomtype: string;
    room_type: string;
    price: number;
    created_at: Date;
    updated_at: Date;
    image: string;
    facility: {
        id_facility: string;
        facility_name: string;
        created_at: Date;
        updated_at: Date;
    }[]
}

export enum ROOMSTATUS {
    AVAILABLE = 'AVAILABLE',
    NOTAVAILABLE= 'NOTAVAILABLE',
  }
  

export class RoomCreateRequest {    
    id_roomtype: string;
    status: ROOMSTATUS;
}

export class RoomUpdateRequest {    
    id_roomtype?: string;
    status?: ROOMSTATUS;
}

export class RoomResponse {
    id_room: string;
    id_roomtype: string;
    status: ROOMSTATUS;
}

export class RoomCreateResponse extends RoomResponse {
    created_at: Date;
    updated_at: Date;
}

export class RoomDetailResponse extends RoomResponse {
    created_at: Date;
    updated_at: Date;
    roomtype: {
        id_roomtype: string;
        price: number;
        created_at: Date;
        updated_at: Date;
        room_type: string;
    };
}
