import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  
  console.log('[Cron] Starting Server Health Check...');
  
  try {
    // Get the server URL from environment or use default
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
    
    // Make a request to the root endpoint
    const response = await axios.get(`${serverUrl}/`);
    
    if (response.status === 200) {
      console.log('[Cron] Server is healthy ✅');
      console.log('Server response:', response.data);
    } else {
      throw new Error(`Server returned unexpected status: ${response.status}`);
    }
    
    console.log('[Cron] Health check completed successfully ✅');
  } catch (error) {
    console.error('[Cron] Health check failed:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap(); 