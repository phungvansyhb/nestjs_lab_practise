import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Log error for debugging
    this.logger.error(
      `Database error: ${exception.message}`,
      exception.stack,
    );

    // ✅ Xử lý duplicate key (fallback nếu service miss)
    if (
      exception.message.includes('Duplicate entry') ||
      (exception as any).code === 'ER_DUP_ENTRY' ||
      (exception as any).code === '23505'
    ) {
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: exception.message,
        error: 'Conflict entities',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ Xử lý foreign key constraint
    if (
      (exception as any).code === 'ER_NO_REFERENCED_ROW_2' ||
      (exception as any).code === '23503'
    ) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Referenced record not found',
        error: 'Bad Request',
        path: request.url,
        timestamp: new Date().toISOString(),
      });
    }

    // ✅ Generic database error
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database operation failed',
      error: 'Internal Server Error',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}