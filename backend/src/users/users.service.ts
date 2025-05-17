import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from 'src/common/validate.service';
import {
  UserLoginRequest,
  UserDetailResponse,
  UserLoginResponse,
  userCreate,
  passwordUpdate,
} from 'src/models/user.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { DeleteResponse } from 'src/models/common.model';
import { UserValidation } from './user.validation';
import axios from 'axios';
import { randomInt } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    private ValidationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(request: UserLoginRequest): Promise<UserLoginResponse> {
    this.logger.info(`Signing in user`);
    this.logger.info(`Request: ${JSON.stringify(request)}`);
    const UserLoginRequest: UserLoginRequest = this.ValidationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        phone: UserLoginRequest.phone,
      },
    });

    if (!user) {
      this.logger.error(`User with phone ${UserLoginRequest.phone} not found`);
      throw new HttpException('Email or password is incorrect ', 404);
    }

    const passwordMatch = await bcrypt.compare(
      UserLoginRequest.password,
      user.password,
    );

    if (!passwordMatch) {
      this.logger.error(
        `Password for user with phone ${UserLoginRequest.phone} is incorrect`,
      );
      throw new HttpException('Email or password is incorrect ', 404);
    }

    const payload = {
      username: user.name,
      isAdmin: user.role,
      sub: {
        name: user.name,
      },
    };
    this.logger.info(`User ${user.name} logged in successfully`);
    return {
      id_user: user.id_user,
      name: user.name,
      role: user.role,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          privateKey: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          privateKey: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }

  async findAll(): Promise<UserDetailResponse[]> {
    this.logger.info(`Finding all users`);

    const users = await this.prismaService.user.findMany({
      where: { deleted: false },
    });

    return users.map((user) => ({
      id_user: user.id_user,
      phone: user.phone,
      name: user.id_user,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));
  }

  async findOne(id: string): Promise<UserDetailResponse> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id_user: id,
      },
      include: {
        tenants: {
          select: {
            id_tenant: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return {
      id_user: user.id_user,
      phone: user.phone,
      name: user.id_user,
      role: user.role as any,
      id_tenant: user.tenants?.id_tenant,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async delete(id: string): Promise<DeleteResponse> {
    this.logger.info(`Deleting user with id ${id}`);

    const user = await this.prismaService.user.findUnique({
      where: {
        id_user: id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    await this.prismaService.user.update({
      where: {
        id_user: id,
      },
      data: {
        deleted: true,
      },
    });

    return {
      message: 'delete success',
    };
  }

  async update(id: string, request): Promise<UserDetailResponse> {
    this.logger.info(`Updating user`);

    const user = await this.prismaService.user.findUnique({
      where: {
        id_user: id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const updateUser = await this.prismaService.user.update({
      where: {
        id_user: id,
      },
      data: request,
    });

    return {
      id_user: updateUser.id_user,
      phone: updateUser.phone,
      name: updateUser.name,
      role: updateUser.role,
      created_at: updateUser.created_at,
      updated_at: updateUser.updated_at,
    };
  }
  async refreshToken(user: any): Promise<UserLoginResponse> {
    const payload = {
      name: user.name,
      sub: {
        name: user.name,
      },
    };

    return {
      id_user: user.id_user,
      name: user.name,
      role: user.isAdmin,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '1h',
          privateKey: process.env.JWT_SECRET_KEY,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          privateKey: process.env.JWT_REFRESH_TOKEN,
        }),
      },
    };
  }

  async createAcount(request: userCreate): Promise<string> {
    this.logger.info(`Creating user`);

    const UserCreateRequest: userCreate = this.ValidationService.validate(
      UserValidation.CREATE,
      request,
    );

    const passwordHash = await bcrypt.hash(UserCreateRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name: UserCreateRequest.name,
        phone: UserCreateRequest.phone,
        password: passwordHash,
        role: UserCreateRequest.role,
      },
    });

    return user.id_user;
  }

  async resetPassword(request: passwordUpdate): Promise<{ message: string }> {
    this.logger.info(`Resetting password`);
    const UserUpdateRequest: passwordUpdate = this.ValidationService.validate(
      UserValidation.RESET,
      request,
    );
    const isValid = await this.prismaService.user.findFirst({
      where: {
        phone: UserUpdateRequest.phone,
        reset_token: UserUpdateRequest.token,
      },
    });

    if (!isValid) {
      throw new HttpException('Invalid token', 401);
    }

    if (!isValid.reset_token_exp || isValid.reset_token_exp < new Date()) {
      throw new HttpException('Token expired', 401);
    }

    const passwordHash = await bcrypt.hash(UserUpdateRequest.password, 10);

    const user = await this.prismaService.user.update({
      where: {
        phone: UserUpdateRequest.phone,
      },
      data: {
        password: passwordHash,
        reset_token: null,
        reset_token_exp: null,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 401);
    }

    return {
      message: 'Password reset successful',
    };
  }

  async sendOTP(request: { phone: string }): Promise<{
    message: string;
    otp: string;
  }> {
    this.logger.info(`Verifying OTP`);

    const user = await this.prismaService.user.findUnique({
      where: {
        phone: request.phone,
      },
    });

    const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');

    const otp_expired = new Date();
    otp_expired.setMinutes(otp_expired.getMinutes() + 5);

    const message = `${otp} adalah kode OTP anda. demi keamanan jangan berikan kode ini kepada siapapun. kode ini berlaku selama 5 menit.`;

    const res = await axios.post(
      `${process.env.OTP_SERVICE}/api/send-message`,
      {
        number: request.phone,
        message,
      },
    );

    await this.prismaService.user.update({
      where: {
        phone: request.phone,
      },
      data: {
        otp: otp,
        otp_exp: otp_expired,
      },
    });

    if (res.status !== 200) {
      this.logger.error(`Error sending OTP: ${res.data}`);
      throw new HttpException('Error sending OTP', 500);
    }

    if (!user) {
      throw new HttpException('User not found', 401);
    }

    return {
      message: 'Verification successful',
      otp: otp,
    };
  }

  async verifyOTP(request: {
    otp: string;
    phone: string;
  }): Promise<{ message: string; token: string }> {
    this.logger.info(`Verifying OTP`);

    const user = await this.prismaService.user.findFirst({
      where: {
        otp: request.otp,
      },
    });

    const otp_expired = new Date();
    otp_expired.setMinutes(otp_expired.getMinutes() + 5);

    if (!user) {
      throw new HttpException('Invalid OTP', 401);
    }

    const token = uuidv4();

    await this.prismaService.user.update({
      where: {
        phone: request.phone,
      },
      data: {
        reset_token: token,
        reset_token_exp: otp_expired,
      },
    });

    if (!user.otp_exp || user.otp_exp < new Date()) {
      throw new HttpException('OTP expired', 401);
    }

    return {
      token,
      message: 'Verification successful',
    };
  }

  async verifyToken(request: {
    token: string;
    phone: string;
  }): Promise<{ message: string }> {
    this.logger.info(`Verifying token`);

    const user = await this.prismaService.user.findUnique({
      where: {
        phone: request.phone,
      },
    });

    if (!user) {
      throw new HttpException('Invalid token', 401);
    }

    if (!user.reset_token_exp || user.reset_token_exp < new Date()) {
      throw new HttpException('Token expired', 401);
    }

    return {
      message: 'Verification successful',
    };
  }
}
