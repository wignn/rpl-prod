import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from 'src/models/http-exception.model';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(new ErrorResponse(HttpStatus.NOT_FOUND, message, 'Not Found'), HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(new ErrorResponse(HttpStatus.UNAUTHORIZED, message, 'Unauthorized'), HttpStatus.UNAUTHORIZED);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(new ErrorResponse(HttpStatus.BAD_REQUEST, message, 'Bad Request'), HttpStatus.BAD_REQUEST);
  }
}

export class ValidationError extends HttpException {
  constructor(message: string) {
    super(new ErrorResponse(HttpStatus.BAD_REQUEST, message, 'Validation Error'), HttpStatus.BAD_REQUEST);
  }
  
}