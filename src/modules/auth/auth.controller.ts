import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto, SignupReqDto, SignupResDto } from "./dtos";
import { GoogleAuthGuard } from "./guards/google-auth.guard";
import { Response } from "express";
import { ForgetPasswordReqDto } from "./dtos/forget-password.dto";
import { ResetPasswordReqDto } from "./dtos/reset-password.dto";
import { UserEntity } from "../../db/entities/user.entity";
import { GetUser } from "./decorators/get-user.decorator";
import { JwtUserAuthGuard } from "./guards/jwt-user-auth.guard";
import { ResetPasswordGuard } from "./guards/reset-password.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: SignupResDto })
  @HttpCode(200)
  @Post("signup")
  async signUp(
    @Body(ValidationPipe) signupReqDto: SignupReqDto
  ): Promise<SignupResDto> {
    return this.authService.signup(signupReqDto);
  }

  @ApiOkResponse({ type: LoginResDto })
  @HttpCode(200)
  @Post("login")
  async login(
    @Body(ValidationPipe) loginReqDto: LoginReqDto
  ): Promise<LoginResDto> {
    return this.authService.login(loginReqDto);
  }

  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  @Get("google/login")
  async googleLogin() {}

  @UseGuards(GoogleAuthGuard)
  @HttpCode(200)
  @Get("google/callback")
  async googleCallback(@Req() req, @Res() res: Response) {
    return await this.authService.validateGoogleUser(req.user, res);
  }

  @HttpCode(200)
  @Post("forget-password")
  async forgetPassword(
    @Body(ValidationPipe) forgetPasswordReqDto: ForgetPasswordReqDto
  ) {
    return await this.authService.forgetPassword(forgetPasswordReqDto.email);
  }

  @HttpCode(200)
  @UseGuards(ResetPasswordGuard)
  @Post("reset-password")
  async resetPassword(
    @GetUser() user: UserEntity,
    @Body() resetPasswordReqDto: ResetPasswordReqDto
  ) {
    this.logger.debug(
      `ResetPasswordReqDto: ${JSON.stringify(resetPasswordReqDto, null, 2)}`
    );
    this.logger.debug(`User received: ${JSON.stringify(user, null, 2)}`);
    return await this.authService.resetPassword(
      user.email,
      resetPasswordReqDto
    );
  }
}
