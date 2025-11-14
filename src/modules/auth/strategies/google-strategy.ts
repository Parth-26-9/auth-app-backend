import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { UserRepository } from "../../user/user.repository";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository
  ) {
    super({
      clientID: configService.get<string>("googleOAuthConfig.clientId"),
      clientSecret: configService.get<string>("googleOAuthConfig.clientSecret"),
      callbackURL: configService.get<string>("googleOAuthConfig.callbackUrl"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { displayName, emails } = profile;
    const googleUser = {
      email: emails[0].value,
      name: displayName,
      password: null,
    };

    done(null, googleUser);
  }
}
