import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UnauthorizedException } from "../../../exceptions/unauthorized.exception";

@Injectable()
export class ResetPasswordGuard extends AuthGuard("resetPassword") {
  JSON_WEB_TOKEN_ERROR = "JsonWebTokenError";

  TOKEN_EXPIRED_ERROR = "TokenExpiredError";

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: Error, context: any, status: any) {
    console.log("=== Reset Password Guard ===");
    console.log("Error:", err);
    console.log("User:", user);
    console.log("Info:", info);
    console.log("Context:", context);
    console.log("Status:", status);

    // You can throw an exception based on either "info" or "err" arguments
    if (info?.name === this.JSON_WEB_TOKEN_ERROR) {
      throw UnauthorizedException.JSON_WEB_TOKEN_ERROR();
    } else if (info?.name === this.TOKEN_EXPIRED_ERROR) {
      throw UnauthorizedException.TOKEN_EXPIRED_ERROR();
    } else if (info) {
      throw UnauthorizedException.UNAUTHORIZED_ACCESS(info.message);
    } else if (err) {
      throw err;
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
