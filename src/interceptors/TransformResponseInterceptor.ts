import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // Get the response status code
        const statusCode = response.statusCode || HttpStatus.OK;

        // Check if data is already in the correct format
        if (this.isAlreadyFormatted(data)) {
          return data;
        }

        // Check if it's a list response (array or has items property)
        if (this.isListResponse(data)) {
          return this.formatListResponse(
            data,
            statusCode,
            request.path,
            request.method,
          );
        }

        // Format single item response
        return this.formatSingleResponse(
          data,
          statusCode,
          request.path,
          request.method,
        );
      }),
    );
  }

  /**
   * Check if response is already formatted
   */
  private isAlreadyFormatted(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'statusCode' in data &&
      'timestamp' in data &&
      'path' in data
    );
  }

  /**
   * Check if response is a list
   */
  private isListResponse(data: any): boolean {
    // Check if it's an array
    if (Array.isArray(data)) {
      return true;
    }

    // Check if it has items property (paginated response)
    if (data && typeof data === 'object' && 'items' in data) {
      return true;
    }

    return false;
  }

  /**
   * Format single item response
   */
  private formatSingleResponse(
    data: any,
    statusCode: HttpStatus,
    path: string,
    method: string,
  ) {
    const message = this.getDefaultMessage(method, statusCode);

    return {
      statusCode,
      message,
      path,
      method,
      timestamp: new Date(),
      data: data || null,
    };
  }

  /**
   * Format list response
   */
  private formatListResponse(
    data: any,
    statusCode: HttpStatus,
    path: string,
    method: string,
  ) {
    const message = this.getDefaultMessage(method, statusCode);

    // If data is already in { items, total } format
    if (data && typeof data === 'object' && 'items' in data) {
      return {
        statusCode,
        message,
        path,
        method,
        timestamp: new Date(),
        data: {
          items: data.items || [],
          total: data.total || data.items?.length || 0,
        },
      };
    }

    // If data is a plain array
    if (Array.isArray(data)) {
      return {
        statusCode,
        message,
        path,
        timestamp: new Date(),
        data: {
          items: data,
          total: data.length,
        },
      };
    }

    // Fallback
    return {
      statusCode,
      message,
      path,
      timestamp: new Date(),
      data: {
        items: [],
        total: 0,
      },
    };
  }

  /**
   * Get default message based on HTTP method and status
   */
  private getDefaultMessage(method: string, statusCode: HttpStatus): string {
    const successMessages: Record<string, string> = {
      GET: 'Data retrieved successfully',
      POST: 'Resource created successfully',
      PUT: 'Resource updated successfully',
      PATCH: 'Resource updated successfully',
      DELETE: 'Resource deleted successfully',
    };

    // If it's a success status code
    if (statusCode >= 200 && statusCode < 300) {
      return successMessages[method] || 'Request successful';
    }

    return 'Request processed';
  }
}