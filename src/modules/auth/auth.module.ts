import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { GoogleStrategy } from "./strategies/google-strategy";
import { JwtUserStrategy } from "./strategies/jwt-user-strategy";
import { MailModule } from "../mail/mail.module";
import { ResetPasswordStrategy } from "./strategies/reset-password.strategy";

@Module({
  imports: [
    UserModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_PUBLIC_KEY,
      signOptions: { expiresIn: "24h" },
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
