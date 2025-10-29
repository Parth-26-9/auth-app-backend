import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

/**
 * Catches all HTTP exceptions thrown by the application and sends an appropriate HTTP response.
 */
@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);

  /**
   * Creates an instance of `HttpExceptionsFilter`.
   *
   * @param {HttpAdapterHost} httpAdapterHost - the HTTP adapter host
   */
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  /**
   * Catches an exception and sends an appropriate HTTP response.
   *
   * @param {HttpException} exception - the exception to catch
   * @param {ArgumentsHost} host - the arguments host
   * @returns {void}
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const httpStatus = exception.getStatus();

    // Get the exception response
    const exceptionResponse = exception.getResponse();

    // Log the exception with proper context
    this.logger.error({
      req: {
        method: request.method,
        url: request.url,
        id: request.id,
      },
      context: HttpExceptionsFilter.name,
      err: {
        type: exception.constructor.name,
        message: exception.message,
        stack: exception.stack,
        response: exceptionResponse,
      },
    });

    // Extract validation messages if they exist
    let errorMessage: any;

    if (
      typeof exceptionResponse === "object" &&
      "message" in exceptionResponse
    ) {
      errorMessage = exceptionResponse.message;
    } else if (typeof exceptionResponse === "string") {
      errorMessage = exceptionResponse;
    } else {
      errorMessage = exception.message || "Something went wrong";
    }

    // Construct the response body
    const responseBody = {
      success: false,
      message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage, // Send first error message
      errors: Array.isArray(errorMessage) ? errorMessage : [errorMessage], // Send all errors
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      traceId: request.id,
    };

    // Send the HTTP response
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
