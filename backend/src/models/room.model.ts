import { ApiProperty } from "@nestjs/swagger";
import { ROOMSTATUS } from "@prisma/client";

export class RoomCreateRequest {    
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    id_roomtype: string;

    

    @ApiProperty({
        example: 'Available',
        required: true,
    })
    status: ROOMSTATUS;
}

export class RoomUpdateRequest {    
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    id_roomtype?: string;
    
    @ApiProperty({
        example: 'Available',
        required: true,
    })
    status?: ROOMSTATUS;
}

export class RoomResponse {
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    id_room: string;
    
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    id_roomtype: string;
    
    @ApiProperty({
        example: 'Available',
        required: true,
    })
    status: ROOMSTATUS;
}

export class RoomCreateResponse extends RoomResponse {
    @ApiProperty({
        example: '2021-08-22',
        required: true,
    })
    created_at: Date;

    @ApiProperty({
        example: '2021-08-22',
        required: true,
    })
    updated_at: Date;
}

export class RoomDetailResponse extends RoomResponse {
    @ApiProperty({
        example: {
            id_roomtype: 'sdanknm3wmnkns',
            price: 200,
            created_at: '2021-08-22',
            updated_at: '2021-08-22',
        },
        required: true,
    })
    created_at:Date;
    updated_at: Date;
    roomtype: {
        id_roomtype: string;
        price: number;
        created_at: Date;
        updated_at: Date;
        room_type: string;
    };
}


export class RoomTypeCreateRequest {
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    facilities: string[]
    @ApiProperty({
        example: 'Deluxe',
        required: true,
    })
    room_type: string;
    
    @ApiProperty({
        example: 'exemple.jpg',
        required: true,
    })
    image: string;

    @ApiProperty({
        example: 2000000,
        required: true,
    })
    price: number;
}

export class RoomTypeUpdateRequest {
    @ApiProperty({
        example: 'Deluxe',
        required: true,
    })
    room_type?: string;
    
    @ApiProperty({
        example: 'exemple.jpg',
        required: true,
    })
    image?: string;

    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    facilities: string[];

    @ApiProperty({
        example: 2000000,
        required: true,
    })
    price?: number;
}

export class RoomTypeResponse {
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    id_roomtype: string;

    @ApiProperty({
        example: 'Deluxe',
        required: true,
    })
    room_type: string;

    @ApiProperty({
        example: 5555555,
        required: true,
    })
    price: number;

    @ApiProperty({
        example: '2021-08-22',
        required: true,
    })
    created_at: Date;

    @ApiProperty({
        example: '2021-08-22',
        required: true,
    })
    updated_at: Date;
}
export class RoomTypeDetailsResponse {
    @ApiProperty({
        example: 'sdanknm3wmnkns',
        required: true,
    })
    id_roomtype: string;

    @ApiProperty({
        example: 'exemple.jpg',
        required: true,
    })
    image?: string;

    @ApiProperty({
        example: 'Deluxe',
        required: true,
    })
    room_type: string;

    @ApiProperty({
        example: 5555555,
        required: true,
    })
    price: number;
    @ApiProperty({
        example: '2021-08-22',
        required: true,
    })
    created_at: Date;

    @ApiProperty({
        example: '2021-08-22',
        required: true,
    })
    updated_at: Date;
    

    @ApiProperty({
        example: {
            id_facility: 'sdanknm3wmnkns',
            facility_name: 'AC',
            created_at: '2021-08-22',
            updated_at: '2021-08-22',
        },
        required: true,
    })
    facility: {
        id_facility: string;
        facility_name: string;
        created_at: Date;
        updated_at: Date;
    }[];
}


