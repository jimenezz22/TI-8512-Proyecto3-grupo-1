import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@/database/database.module';
import { AppController } from './app.controller'; 
import appConfig from '@/config/app.config';
import databaseConfig from '@/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    DatabaseModule,
  ],
  controllers: [AppController], 
})
export class AppModule {}