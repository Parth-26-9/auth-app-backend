import { BadRequestException, Injectable } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginReqDto, LoginResDto, SignupReqDto, SignupResDto } from "./dtos";
import * as bcrypt from "bcryptjs";
import { UserEntity } from "../../db/entities/user.entity";
import { UnauthorizedException } from "../../exceptions";
import { JwtUserPayload } from "./interfaces/jwt-user-payload.interface";

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async signup(signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { email, password } = signupReqDto;

    const user = await this.userRepository.findbyEmail(email);

    if (user) {
      throw new BadRequestException(`User with ${email} already present`);
    }

    const saltOrRounds = this.SALT_ROUNDS;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const userPayload: UserEntity = {
      email,
      password: hashedPassword,
      registerCode: this.generateCode().toString(),
      id: "",
      createdAt: undefined,
      updatedAt: undefined,
    };

    await this.userRepository.create(userPayload);

    return {
      message: "User signup successfully",
    };
  }

  generateCode(): number {
    const OTP_MIN = 100000;
    const OTP_MAX = 999999;
    return Math.floor(Math.random() * (OTP_MAX - OTP_MIN + 1)) + OTP_MIN;
  }

  async login(loginReqDto: LoginReqDto): Promise<LoginResDto> {
    const { email, password } = loginReqDto;

    const user = await this.userRepository.findbyEmail(email);

    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS("Invalid credentials");
    }

    const payload: JwtUserPayload = {
      user: user.id,
      email: user.email,
      code: Number(user.registerCode),
    };
    const accessToken = await this.jwtService.signAsync(payload);

    delete user.password;

    return {
      message: "Login successfull",
      accessToken,
      user,
    };
  }
}
