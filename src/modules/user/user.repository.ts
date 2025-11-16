import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../db/db.service";
import { UserEntity } from "../../db/entities/user.entity";

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userData: UserEntity) {
    try {
      return await this.prismaService.user.create({ data: userData });
    } catch (error) {
      throw new HttpException(
        "Something is wrong while create user",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findById(userId: string) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      throw new HttpException(
        "Something is wrong while fetch user by id",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async findbyEmail(email: string) {
    try {
      return await this.prismaService.user.findUnique({ where: { email } });
    } catch (error) {
      throw new HttpException(
        "Something is wrong while fetch user by email",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updatePasswordAndRefreshCode(
    userId: string,
    password: string,
    code: number
  ) {
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: {
          password,
          registerCode: String(code),
        },
      });
    } catch (error) {
      throw new HttpException(
        "Something is wrong while update password and refresh token",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
