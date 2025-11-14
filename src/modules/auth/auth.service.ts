import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "../user/user.repository";
import { JwtService } from "@nestjs/jwt";
import { LoginReqDto, LoginResDto, SignupReqDto, SignupResDto } from "./dtos";
import * as bcrypt from "bcryptjs";
import { Response } from "express";
import { UserEntity } from "../../db/entities/user.entity";
import { UnauthorizedException } from "../../exceptions";
import { JwtUserPayload } from "./interfaces/jwt-user-payload.interface";
import { ConfigService } from "@nestjs/config";
import { JwtForgetPasswordPayload } from "./interfaces/jwt-forget-password.interface";
import { MailService } from "../mail/mail.service";
import { ResetPasswordReqDto } from "./dtos/reset-password.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private FRONTEND_URL: string;
  private readonly SALT_ROUNDS = 10;
  private JWTSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {
    this.FRONTEND_URL = this.configService.get("frontendUrl");
  }

  async signup(signupReqDto: SignupReqDto): Promise<SignupResDto> {
    const { email, password, name, authProvider } = signupReqDto;

    let hashedPassword = "";

    if (authProvider !== "GOOGLE") {
      const saltOrRounds = this.SALT_ROUNDS;
      hashedPassword = await bcrypt.hash(password, saltOrRounds);
    }

    const user = await this.userRepository.findbyEmail(email);

    if (user) {
      throw new BadRequestException(`User with ${email} already present`);
    }

    const userPayload: UserEntity = {
      email,
      name,
      password: authProvider !== "GOOGLE" ? hashedPassword : null,
      registerCode: this.generateCode().toString(),
      authProvider,
    };

    await this.userRepository.create(userPayload);

    return {
      message: "User registred successfully",
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
      throw UnauthorizedException.UNAUTHORIZED_ACCESS(
        `User not found with ${email}.`
      );
    }

    if (user.authProvider === "DEFAULT") {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw UnauthorizedException.UNAUTHORIZED_ACCESS(
          `Password is not mathcing`
        );
      }
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

  async validateGoogleUser(googleUser: any, res: Response) {
    this.logger.debug(
      `Google user received: ${JSON.stringify(googleUser, null, 2)}`
    );
    let user: any;
    if (googleUser?.email) {
      user = await this.userRepository.findbyEmail(googleUser?.email);
    }
    if (!user) {
      await this.signup({
        name: googleUser.name,
        email: googleUser.email,
        password: null,
        authProvider: "GOOGLE",
      });
      const result = await this.login({
        email: googleUser.email,
        password: null,
      });
      const url = `${this.FRONTEND_URL}/auth/callback?token=${result.accessToken}`;
      return res.redirect(url);
    }
    return await this.login({
      email: user.email,
      password: user.password,
    });
  }

  async forgetPassword(email: string) {
    const user = await this.userRepository.findbyEmail(email);
    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS("user not found");
    }

    if (user.authProvider === "GOOGLE") {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS(
        "User was logged in throw google"
      );
    }

    const payload: JwtForgetPasswordPayload = {
      user: user.id,
      code: user.registerCode,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });

    const url = `${this.FRONTEND_URL}/auth/reset-password?token=${token}`;

    this.logger.debug(`Forget password token : ${token}`);

    await this.mailService.sendPasswordResetEmail(user.email, user.name, url);

    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  }

  async resetPassword(email: string, resetPasswrod: ResetPasswordReqDto) {
    const user = await this.userRepository.findbyEmail(email);
    const { password } = resetPasswrod;
    const saltOrRounds = this.SALT_ROUNDS;
    let hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const updatedCode = this.generateCode();
    await this.userRepository.updatePasswordAndRefreshCode(
      user.id,
      hashedPassword,
      updatedCode
    );
    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}
