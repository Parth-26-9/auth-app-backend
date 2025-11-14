import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard("google") {
  JSON_WEB_TOKEN_ERROR = "JsonWebTokenError";

  TOKEN_EXPIRED_ERROR = "TokenExpiredError";

  private readonly logger = new Logger(GoogleAuthGuard.name);

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: Error, context: any, status: any) {
    if (err) {
      throw err;
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
