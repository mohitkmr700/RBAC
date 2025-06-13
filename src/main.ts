import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

const env: number = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');

  // Enable cookie parsing
  app.use(cookieParser());

  const allowedOrigins = [
    'http://localhost:4000',
    'http://localhost:3000',
    'https://algoarena.co.in',
    'https://www.algoarena.co.in'
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) {
        return callback(null, true);
      }

      // Check if the origin is in our allowedOrigins list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Log rejected origins for debugging
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 3600 // 1 hour
  });

  // Add global logging middleware
  app.use((req, res, next) => {
    const { method, originalUrl } = req;
    const startTime = Date.now();
    
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      logger.log(`${method} ${originalUrl} ${res.statusCode} - ${responseTime}ms`);
    });
    
    next();
  });

  await app.listen(env);
  logger.log(`Application is running on: http://localhost:${env}`);
  logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}
bootstrap();
