import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "../../user/user.repository";
import { AcceptUserInvitePayload } from "../interfaces";
import { UnauthorizedException } from "../../../exceptions";

@Injectable()
export class AcceptInviteUserStrategy extends PassportStrategy(
  Strategy,
  "acceptUserInvite"
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

  async validate(payload: AcceptUserInvitePayload) {
    const fetchedUser = await this.userRepository.findById(payload.user);
    if (!fetchedUser) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS("User not found");
    }
    if (fetchedUser.registerCode !== payload.code) {
      throw UnauthorizedException.INVALID_RESET_PASSWORD_TOKEN(
        "Reset password token is not valid"
      );
    }
    return fetchedUser;
  }
}
