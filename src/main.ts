import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Load environment variables
dotenv.config();

const env: number = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');

  // Enable cookie parsing
  app.use(cookieParser());

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('Authentication and User Management API with Supabase integration')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for @ApiBearerAuth() decorator
    )
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
  
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
  logger.log(`📚 Swagger documentation available at: http://localhost:${env}/api`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🔒 CORS enabled with allowed origins: ${allowedOrigins.join(', ')}`);
}
bootstrap();
