import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'StarWars API is running! 🚀';
  }

  @Get('test')
  getTest() {
    return {
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
        host: process.env.DATABASE_HOST,
        name: process.env.DATABASE_NAME,
      },
    };
  }
}