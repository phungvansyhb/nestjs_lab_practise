import { TransformResponseInterceptor } from './TransformResponseInterceptor';
import { ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { of } from 'rxjs';

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new TransformResponseInterceptor();

    // Mock ExecutionContext
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          path: '/users',
          url: '/users',
          method: 'GET',
        }),
        getResponse: jest.fn().mockReturnValue({
          statusCode: HttpStatus.OK,
        }),
      }),
    } as any;

    // Mock CallHandler
    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  describe('Single item response', () => {
    it('should format single object response', (done) => {
      const mockData = { id: 1, name: 'John' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('statusCode', HttpStatus.OK);
          expect(result).toHaveProperty('message', 'Data retrieved successfully');
          expect(result).toHaveProperty('path', '/users');
          expect(result).toHaveProperty('timestamp');
          expect(result).toHaveProperty('data', mockData);
          expect(result.data).toEqual(mockData);
          done();
        },
      });
    });

    it('should handle null data', (done) => {
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(null));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.data).toBeNull();
          done();
        },
      });
    });

    it('should handle undefined data', (done) => {
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(undefined));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.data).toBeNull();
          done();
        },
      });
    });
  });

  describe('List response', () => {
    it('should format array response', (done) => {
      const mockData = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toHaveProperty('statusCode', HttpStatus.OK);
          expect(result).toHaveProperty('message', 'Data retrieved successfully');
          expect(result).toHaveProperty('data');
          expect(result.data).toHaveProperty('items', mockData);
          expect(result.data).toHaveProperty('total', 2);
          done();
        },
      });
    });

    it('should format paginated response with items and total', (done) => {
      const mockData = {
        items: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ],
        total: 10,
      };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.data).toHaveProperty('items', mockData.items);
          expect(result.data).toHaveProperty('total', 10);
          done();
        },
      });
    });

    it('should handle empty array', (done) => {
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of([]));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.data).toHaveProperty('items', []);
          expect(result.data).toHaveProperty('total', 0);
          done();
        },
      });
    });
  });

  describe('HTTP Methods', () => {
    it('should return correct message for POST', (done) => {
      mockExecutionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({
        path: '/users',
        method: 'POST',
      });

      const mockData = { id: 1, name: 'John' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.message).toBe('Resource created successfully');
          done();
        },
      });
    });

    it('should return correct message for PUT', (done) => {
      mockExecutionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({
        path: '/users/1',
        method: 'PUT',
      });

      const mockData = { id: 1, name: 'John Updated' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.message).toBe('Resource updated successfully');
          done();
        },
      });
    });

    it('should return correct message for DELETE', (done) => {
      mockExecutionContext.switchToHttp().getRequest = jest.fn().mockReturnValue({
        path: '/users/1',
        method: 'DELETE',
      });

      const mockData = { affected: 1 };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.message).toBe('Resource deleted successfully');
          done();
        },
      });
    });
  });

  describe('Already formatted response', () => {
    it('should not re-format already formatted response', (done) => {
      const alreadyFormatted = {
        statusCode: HttpStatus.OK,
        message: 'Custom message',
        path: '/users',
        timestamp: new Date(),
        data: { id: 1, name: 'John' },
      };

      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(alreadyFormatted));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result).toEqual(alreadyFormatted);
          expect(result.message).toBe('Custom message');
          done();
        },
      });
    });
  });

  describe('Status codes', () => {
    it('should use response status code', (done) => {
      mockExecutionContext.switchToHttp().getResponse = jest.fn().mockReturnValue({
        statusCode: HttpStatus.CREATED,
      });

      const mockData = { id: 1, name: 'John' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.statusCode).toBe(HttpStatus.CREATED);
          done();
        },
      });
    });

    it('should default to 200 OK if no status code', (done) => {
      mockExecutionContext.switchToHttp().getResponse = jest.fn().mockReturnValue({});

      const mockData = { id: 1, name: 'John' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          expect(result.statusCode).toBe(HttpStatus.OK);
          done();
        },
      });
    });
  });

  describe('Timestamp', () => {
    it('should add current timestamp', (done) => {
      const mockData = { id: 1, name: 'John' };
      (mockCallHandler.handle as jest.Mock).mockReturnValue(of(mockData));

      const before = new Date();

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (result) => {
          const after = new Date();
          const timestamp = new Date(result.timestamp);

          expect(timestamp).toBeInstanceOf(Date);
          expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
          expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
          done();
        },
      });
    });
  });
});
