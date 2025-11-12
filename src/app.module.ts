import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CsrfModule } from './csrf/csrf.module';
import { DataSource } from 'typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      envFilePath: '.env', // Path to .env file
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 3307,
      username: process.env.DB_USERNAME || 'sypv',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'test',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production!
    }),
    UsersModule,
    CsrfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private datasource : DataSource){}
}
