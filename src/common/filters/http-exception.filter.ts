import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {

    // switchToHttp - gives access to native in-flight request response objects
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // extract status and message from current exception
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error = typeof response === "string" ?
      { message: exceptionResponse } : (exceptionResponse as object);

    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString()
    });
  }
}
