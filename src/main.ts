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
      // Log all incoming requests with their origin
      logger.log(`🔒 CORS Request from origin: ${origin || 'No origin'}`);

      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) {
        logger.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }

      // Check if the origin is in our allowedOrigins list
      if (allowedOrigins.includes(origin)) {
        logger.log(`✅ CORS: Allowing request from allowed origin: ${origin}`);
        return callback(null, true);
      }

      // Log rejected origins for debugging
      logger.warn(`❌ CORS: Blocked request from unauthorized origin: ${origin}`);
      logger.warn(`📋 Allowed origins are: ${allowedOrigins.join(', ')}`);
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
    const { method, originalUrl, headers } = req;
    const startTime = Date.now();
    
    // Log request details
    logger.log(`📥 Incoming ${method} request to ${originalUrl}`);
    logger.log(`🔑 Headers: ${JSON.stringify(headers, null, 2)}`);
    
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      logger.log(`📤 Response ${res.statusCode} for ${method} ${originalUrl} - ${responseTime}ms`);
    });
    
    next();
  });

  await app.listen(env);
  logger.log(`🚀 Application is running on: http://localhost:${env}`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🔒 CORS enabled with allowed origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
