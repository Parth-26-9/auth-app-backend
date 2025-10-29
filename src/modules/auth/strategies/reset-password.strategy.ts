import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "../../user/user.repository";
import { JwtForgetPasswordPayload } from "../interfaces/jwt-forget-password.interface";
import { UnauthorizedException } from "../../../exceptions";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ResetPasswordStrategy extends PassportStrategy(
  Strategy,
  "resetPassword"
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("jwt.publicKey"),
    });
  }

  async validate(payload: JwtForgetPasswordPayload) {
    console.log("JWT Payload:", payload);
    console.log("User ID:", payload.user);
    console.log("Code:", payload.code);
    const { user } = payload;
    const fetchedUser = await this.userRepository.findById(user);
    if (!fetchedUser) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS("User not found");
    }
    if (fetchedUser.authProvider === "GOOGLE") {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS(
        "User was logged in throw google"
      );
    }
    if (fetchedUser.registerCode !== payload.code) {
      throw UnauthorizedException.INVALID_RESET_PASSWORD_TOKEN(
        "Reset password token is not valid"
      );
    }
    return true;
  }
}
