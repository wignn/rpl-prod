import { Controller, Get, Param } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentDetailsResponse } from 'src/models/rent.model';
import { ApiResponse } from '@nestjs/swagger';

@Controller('api/rent')
export class RentController {
    constructor(private readonly rentService: RentService){}

    
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Returns all rents',
        type: [RentDetailsResponse],
        isArray: true,
    })
    @ApiResponse({
        status: 404,
        description: 'No rents found',
    })
    async findAll(): Promise<RentDetailsResponse[]> {
        return this.rentService.findAll();
    }



    @Get(':id_rent')
    @ApiResponse({
        status: 200,
        description: 'Returns a rent by ID',
        type: RentDetailsResponse,
    })
    async findOne(
        @Param('id_rent') id_rent: string): Promise<RentDetailsResponse> {
        return this.rentService.findOne(id_rent);
    }
}
