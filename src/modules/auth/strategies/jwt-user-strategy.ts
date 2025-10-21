import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JwtUserPayload } from "../interfaces/jwt-user-payload.interface";
import { UnauthorizedException } from "../../../exceptions";
import { UserRepository } from "../../user/user.repository";

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, "authUser") {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("jwt.publicKey"),
    });
  }

  async validate(payload: JwtUserPayload) {
    const user = await this.userRepository.findById(payload.user);
    if (!user) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS();
    }
    if (payload.code !== Number(user.registerCode)) {
      throw UnauthorizedException.REQUIRED_RE_AUTHENTICATION();
    }
    delete user.password;
    return user;
  }
}
