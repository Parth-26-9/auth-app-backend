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

@Module({
  imports: [
    UserModule,
    MailModule,
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
  ],
  exports: [],
})
export class AuthModule {}
