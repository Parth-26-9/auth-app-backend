import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { MailService } from "../mail/mail.service";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "../../db/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { InviteUserPayload } from "./interfaces/invite-user-payload.interface";
import { CommonResponseDto } from "../../shared/dtos";
import { AuthProvider } from "@prisma/client";
import { AcceptInviteUserDto, InviteUserReqDto } from "./dtos";
import { RoleRepository } from "../role/role.repository";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
  private FRONTEND_URL: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly roleRepository: RoleRepository
  ) {
    this.FRONTEND_URL = this.configService.get("frontendUrl");
  }

  async invite(
    inviteUserReqDto: InviteUserReqDto
  ): Promise<CommonResponseDto<undefined>> {
    const { email, role } = inviteUserReqDto;
    const userPayload: UserEntity = {
      email,
      name: this.fetchedNameFromEmail(email),
      password: "",
      registerCode: this.generateCode().toString(),
      authProvider: AuthProvider.DEFAULT,
    };
    const invitedUserDbResult = await this.userRepository.create(userPayload);
    await this.roleRepository.create({ userId: invitedUserDbResult.id, role });
    const payload: InviteUserPayload = {
      user: invitedUserDbResult.id,
      code: invitedUserDbResult.registerCode,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "30m",
    });
    const resetUrl = `${this.FRONTEND_URL}/user/invite?token=${token}`;
    await this.mailService.inviteUser(email, resetUrl);
    return {
      success: true,
      message: "User invited successfully",
      data: undefined,
    };
  }

  generateCode(): number {
    const OTP_MIN = 100000;
    const OTP_MAX = 999999;
    return Math.floor(Math.random() * (OTP_MAX - OTP_MIN + 1)) + OTP_MIN;
  }

  fetchedNameFromEmail(email: string): string {
    let name = "";

    for (const char of email) {
      if (char === "@") {
        break;
      }
      name = name + char;
    }

    return name;
  }

  async acceptInvite(
    acceptInviteUserDto: AcceptInviteUserDto,
    user: UserEntity
  ): Promise<CommonResponseDto<undefined>> {
    const hashedPassword = await bcrypt.hash(acceptInviteUserDto?.password, 10);
    const updatedCode = this.generateCode();
    await this.userRepository.updatePasswordAndRefreshCode(
      user.id,
      hashedPassword,
      updatedCode
    );

    return {
      success: true,
      message: "User accept successfully",
      data: undefined,
    };
  }
}
