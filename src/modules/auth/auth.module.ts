import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { GoogleStrategy } from "./strategies/google-strategy";
import { JwtUserStrategy } from "./strategies/jwt-user-strategy";
import { MailModule } from "../mail/mail.module";
import { ResetPasswordStrategy } from "./strategies/reset-password.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RoleModule } from "../role/role.module";
import { AcceptInviteUserStrategy } from "./strategies/accept-invite-user.strategy";

@Module({
  imports: [
    UserModule,
    MailModule,
    RoleModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("jwt.publicKey"),
        signOptions: {
          expiresIn: "1h",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtUserStrategy,
    ResetPasswordStrategy,
    AcceptInviteUserStrategy,
  ],
  exports: [],
})
export class AuthModule {}
