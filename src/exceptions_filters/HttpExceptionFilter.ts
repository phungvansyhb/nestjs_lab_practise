import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter to format all HTTP exceptions
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Log the error
    this.logger.error(
      `HTTP ${status} Error: ${request.method} ${request.url}`,
      exception.stack,
    );

    // Extract error message
    const errorMessage = this.getErrorMessage(exceptionResponse);
    const errorName = exception.name || 'Error';

    // Format error response
    const errorResponse = {
      statusCode: status,
      message: errorMessage,
      error: errorName,
      path: request.url,
      timestamp: new Date(),
      data: null,
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Extract error message from exception response
   */
  private getErrorMessage(exceptionResponse: any): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object') {
      // Handle validation errors (array of messages)
      if (Array.isArray(exceptionResponse.message)) {
        return exceptionResponse.message.join(', ');
      }

      // Handle single message
      if (exceptionResponse.message) {
        return exceptionResponse.message;
      }

      // Handle error property
      if (exceptionResponse.error) {
        return exceptionResponse.error;
      }
    }

    return 'An error occurred';
  }
}
