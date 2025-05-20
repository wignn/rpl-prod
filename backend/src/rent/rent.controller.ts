import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentDetailsResponse } from 'src/models/rent.model';
import { ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('api/rent')
export class RentController {
    constructor(private readonly rentService: RentService){}


    @UseGuards(JwtGuard)
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


    @UseGuards(JwtGuard)
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
