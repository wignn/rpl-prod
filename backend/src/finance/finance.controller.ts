import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceCreateRequest, FinanceDetailsResponse, FinanceResponse } from 'src/models/finance.model';
import { ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('api/finance')
export class FinanceController {
    constructor(
        private readonly financeService: FinanceService
    ){}

    @UseGuards(JwtGuard)
    @Post()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Finance created successfully',
        type: FinanceResponse,
    })
    async createFinance(
        @Body() request: FinanceCreateRequest
    ) :Promise<FinanceResponse> {
        return this.financeService.create(request);
    }

    @UseGuards(JwtGuard)
    @Get()
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Get all finance',
        type: FinanceResponse,
        isArray: true,
    })
    async getAllFinance(
    ): Promise<FinanceDetailsResponse[]> {
        return this.financeService.getAll();
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Get finance by id',
        type: FinanceResponse,
    })
    async getFinanceById(
        @Param('id') id: string
    ):Promise<FinanceDetailsResponse>{
        return this.financeService.getById(id);
    }

    
    @UseGuards(JwtGuard)
    @Put(':id')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Update finance by id',
        type: FinanceResponse,
    })
    async updateFinanceById(
        @Param('id') id: string,
        @Body() request: FinanceCreateRequest
    ):Promise<FinanceResponse>{
        return this.financeService.update(id, request);
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'Delete finance by id',
        type: FinanceResponse,
    })
    async deleteFinanceById(
        @Param('id') id: string
    ):Promise<FinanceResponse>{
        return this.financeService.delete(id);
    }
}
