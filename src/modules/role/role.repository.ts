import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../db/db.service";
import { CreateRoleDto } from "./role.dto";

@Injectable()
export class RoleRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(roleData: CreateRoleDto) {
    try {
      await this.prismaService.role.create({ data: roleData });
    } catch (error) {
      throw new HttpException(
        "Something is wrong while create role",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getRoleOfUser(userId: string) {
    try {
      return await this.prismaService.role.findUnique({ where: { userId } });
    } catch (error) {
      throw new HttpException(
        "Something is wrong while fetching details of user",
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
