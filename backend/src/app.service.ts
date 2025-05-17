import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): {
    message: string;
    status: number;
    version: string;
  } {
    return {
      message: 'API Working',
      status: 200,
      version: '1.0.0',
    };
  }
}
