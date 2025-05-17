import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validate.service';
import { FinanceCreateRequest, FinanceDetailsResponse, FinanceResponse } from 'src/models/finance.model';
import { Logger } from 'winston';
import { FinanceValidation } from './finance.validation';

@Injectable()
export class FinanceService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async create(request: FinanceCreateRequest): Promise<FinanceResponse> {
    this.logger.info('Creating finance');
    const financeCreateRequest: FinanceCreateRequest = this.validationService.validate(
      FinanceValidation.CREATE,
      request,
    );
  
    const finance = await this.prismaService.finance.create({
      data: financeCreateRequest,
    })


    this.logger.info('Finance created successfully', { finance });
    return {
      id_finance: finance.id_finance,
      id_tenant: finance.id_tenant || undefined,
      id_rent: finance.id_rent || undefined,
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      payment_date: finance.payment_date,
      created_at: finance.created_at,
      updated_at: finance.updated_at,
    }
  }

  async getAll(): Promise<FinanceDetailsResponse[]> {
    this.logger.info('Getting all finance');
    const finances = await this.prismaService.finance.findMany({
      where: {
        deleted: false,
        
      },
      include: {
        tenant: true,
        rentData: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    this.logger.info('Finances retrieved successfully', { finances });
    return finances.map((finance) => ({
      id_finance: finance.id_finance,
      id_tenant: finance.id_tenant ?? "", 
      id_rent: finance.id_rent ?? "",     
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      payment_date: finance.payment_date,
      created_at: finance.created_at,
      updated_at: finance.updated_at,
      tenant: {
        id_tenant: finance.tenant?.id_tenant ?? "", 
        name: finance.tenant?.full_name ?? "",     
      },
      rentData: {
        id_rent: finance.rentData?.id_rent ?? "",      
        id_room: finance.rentData?.roomId ?? "",       
        rent_date: finance.rentData?.rent_date ?? new Date(0), 
      },
    }));
    
  }

  async getById(id: string): Promise<FinanceDetailsResponse> {
    this.logger.info('Getting finance by id', { id });
    const finance = await this.prismaService.finance.findUnique({
      where: {
        id_finance: id,
        deleted: false,
      },
      include: {
        tenant: true,
        rentData: true,
      },
    });

    if (!finance) {
      this.logger.error('Finance not found', { id });
      throw new Error('Finance not found');
    }

    this.logger.info('Finance retrieved successfully', { finance });
    return {
      id_finance: finance.id_finance,
      id_tenant: finance.id_tenant ?? "", 
      id_rent: finance.id_rent ?? "",     
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      payment_date: finance.payment_date,
      created_at: finance.created_at,
      updated_at: finance.updated_at,
      tenant: {
        id_tenant: finance.tenant?.id_tenant ?? "", 
        name: finance.tenant?.full_name ?? "",     
      },
      rentData: {
        id_rent: finance.rentData?.id_rent ?? "",      
        id_room: finance.rentData?.roomId ?? "",       
        rent_date: finance.rentData?.rent_date ?? new Date(0), 
      },
    };
  }

  async update(id: string, request: FinanceCreateRequest): Promise<FinanceResponse> {
    this.logger.info('Updating finance', { id });
    const financeUpdateRequest: FinanceCreateRequest = this.validationService.validate(
      FinanceValidation.CREATE,
      request,
    );

    const finance = await this.prismaService.finance.update({
      where: {
        id_finance: id,
        deleted: false,
      },
      data: financeUpdateRequest,
    });

    if (!finance) {
      this.logger.error('Finance not found', { id });
      throw new Error('Finance not found');
    }

    this.logger.info('Finance updated successfully', { finance });
    return {
      id_finance: finance.id_finance,
      id_tenant: finance.id_tenant || undefined,
      id_rent: finance.id_rent || undefined,
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      payment_date: finance.payment_date,
      created_at: finance.created_at,
      updated_at: finance.updated_at,
    };
  }

  async delete(id: string): Promise<FinanceResponse> {
    this.logger.info('Deleting finance', { id });
    const finance = await this.prismaService.finance.update({
      where: {
        id_finance: id,
        deleted: false,
      },
      data: {
        deleted: true,
      },
    });

    if (!finance) {
      this.logger.error('Finance not found', { id });
      throw new Error('Finance not found');
    }

    this.logger.info('Finance deleted successfully', { finance });
    return {
      id_finance: finance.id_finance,
      id_tenant: finance.id_tenant || undefined,
      id_rent: finance.id_rent || undefined,
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      payment_date: finance.payment_date,
      created_at: finance.created_at,
      updated_at: finance.updated_at,
    };
  }
}
