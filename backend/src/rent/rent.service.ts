import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { RentDetailsResponse } from 'src/models/rent.model';
import { Logger } from 'winston';

@Injectable()
export class RentService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly prismaService: PrismaService,  
    ){}


    async findAll():Promise<RentDetailsResponse[]> {
        this.logger.info("Getting all rents")
        const res = await this.prismaService.rentData.findMany({
            where:{
                deleted: false,
                
            },
            
        })

        this.logger.info("Rents retrieved successfully", {res})
        return res.map((rent) => ({
            id_rent: rent.id_rent,
            tenantId: rent.tenantId,
            roomId: rent.roomId,
            rent_date: rent.rent_date,
            rent_out: rent.rent_out || undefined, 
            created_at: rent.created_at,
            updated_at: rent.updated_at,
        }))
    }

    async findOne(id_rent: string):Promise<RentDetailsResponse> {
        this.logger.info("Getting rent with id: ", {id_rent})
        const res = await this.prismaService.rentData.findUnique({
            where: {
                id_rent: id_rent,
                deleted: false,
            }
        })

        if (!res) {
            this.logger.error("Rent not found", {id_rent})
            throw new Error("Rent not found")
        }

        this.logger.info("Rent retrieved successfully", {res})
        return {
            id_rent: res.id_rent,
            tenantId: res.tenantId,
            roomId: res.roomId,
            rent_date: res.rent_date,
            rent_out: res.rent_out || undefined, 
            created_at: res.created_at,
            updated_at: res.updated_at,
        }
    }

}

