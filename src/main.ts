import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { createCsrfUtilities } from './csrf/csrf.config';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;

const { doubleCsrfProtection } = createCsrfUtilities();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))
  // Enable cookie parser middleware (required for CSRF)
  app.use(cookieParser());
  // Apply CSRF protection middleware globally
  app.use(doubleCsrfProtection);
  
  await app.listen(process.env.PORT ?? 3000);
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
