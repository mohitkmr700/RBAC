import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'API is live 🎯',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'operational'
    };
  }
} 