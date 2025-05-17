import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Put,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  UserLoginRequest,
  UserLoginResponse,
  UserDetailResponse,
  UserUpdateRequest,
  userCreate,
  passwordUpdate,
} from 'src/models/user.model';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { DeleteResponse } from 'src/models/common.model';
import { ErrorResponse } from 'src/models/http-exception.model';
import { ValidationError } from 'src/models/custom-exception';
import { RefreshJwtGuard } from 'src/guards/refresh.guard';


@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: UserLoginResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ValidationError,
  })
  @ApiResponse({
    status: 404,
    description: 'Email or password is incorrect',
    type: ErrorResponse,
  })
  async login(@Body() request: UserLoginRequest): Promise<UserLoginResponse> {
    return this.usersService.signIn(request);
  }

  @UseGuards(JwtGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Users successfully retrieved',
    type: [UserDetailResponse],
  })
  async findAll(): Promise<UserDetailResponse[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User successfully found',
    type: UserDetailResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponse,
  })
  async findOne(@Param('id') id: string): Promise<UserDetailResponse> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: UserDetailResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponse,
  })
  async update(
    @Param('id') id: string,
    @Body() request: UserUpdateRequest,
  ): Promise<UserDetailResponse> {
    return this.usersService.update(id, request);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
    type: DeleteResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    type: ErrorResponse,
  })
  async delete(@Param('id') id: string): Promise<DeleteResponse> {
    return this.usersService.delete(id);
  }

  @UseGuards(RefreshJwtGuard)
  @Patch('refresh')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully refreshed',
    type: UserLoginResponse,
  })
  async refresh(@Body() request: any): Promise<UserLoginResponse> {
    return this.usersService.refreshToken(request);
  }

  @Post('create')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully created',
    type: 'create success',
  })
  async create(@Body() request: userCreate): Promise<string> {
    return this.usersService.createAcount(request);
  }

  @Patch('reset-password')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully reset',
    type: 'reset success',
  })
  async reset(
    @Body() request: passwordUpdate,
  ): Promise<{message:string}> {
    console.log('request', request);
    return this.usersService.resetPassword(request);
  }

  @Post('send-otp')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully sent OTP',
    schema: {
      properties: {
        message: { type: 'string', example: 'OTP sent successfully' },
        token: { type: 'string' }
      }
    }
  })
  async sendOtp(@Body() request: {phone: string}): Promise<{
    message: string;
    otp: string;
  }> {
    return this.usersService.sendOTP(request);
  }


  @Post('verify-otp')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully verified OTP',
    type: 'verify success',
  })
  async verifyOtp(@Body() request: {otp: string, phone: string}): Promise<{message: string, token: string}> {
    return this.usersService.verifyOTP(request);
  }

  @Post('verify-token')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully verified token',
    schema: {
      properties: {
        message: { type: 'string' }
      }
    }
  })
  async verifyToken(@Body() request: {token: string, phone: string}): Promise<{message: string}> {
    return this.usersService.verifyToken(request);
  }
}
