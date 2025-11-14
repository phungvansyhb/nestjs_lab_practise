import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { createCsrfUtilities } from './csrf/csrf.config';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseExceptionFilter, HttpExceptionFilter } from './exceptions_filters';
import { TransformResponseInterceptor } from './interceptors/TransformResponseInterceptor';
declare const module: any;

const { doubleCsrfProtection } = createCsrfUtilities();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // ✅ Global Pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  // ✅ Global Filters (order matters: specific to general)
  app.useGlobalFilters(
    new HttpExceptionFilter(),      // HTTP exceptions (400, 404, 500, etc.)
    new DatabaseExceptionFilter(),  // Database exceptions
  );

  // ✅ Global Interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  app.use(cookieParser());
  app.use(doubleCsrfProtection);
  
  await app.listen(process.env.PORT ?? 3000);
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
