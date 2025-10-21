import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginReqDto, LoginResDto, SignupReqDto, SignupResDto } from "./dtos";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
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
}
