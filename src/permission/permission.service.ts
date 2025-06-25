import { Injectable, Logger } from '@nestjs/common';
import { pb } from './pocketbase.client';
import { CreatePermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  async createPermission(createPermissionDto: CreatePermissionDto) {
    try {
      this.logger.log(`Creating permission for email: ${createPermissionDto.email}`);

      // Mandatory admin authentication
      const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
      const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        throw new Error('POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables are required');
      }

      try {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        this.logger.log('Authenticated as PocketBase admin');
      } catch (authError) {
        this.logger.error('Failed to authenticate as PocketBase admin:', authError.message);
        throw new Error(`PocketBase admin authentication failed: ${authError.message}`);
      }

      // Generate current date/time in local timezone to avoid UTC conversion issues
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;

      const data = {
        email: createPermissionDto.email,
        modules: JSON.stringify(createPermissionDto.modules),
        permissions: JSON.stringify(createPermissionDto.permissions),
        updated_by: createPermissionDto.updated_by,
        created: currentDateTime,
        updated: currentDateTime,
      };

      const record = await pb.collection('control_system').create(data);

      this.logger.log(`Permission created successfully for email: ${createPermissionDto.email}`);

      // Handle both string and object responses from PocketBase
      const parseField = (field: any) => {
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field;
          }
        }
        return field;
      };

      return {
        id: record.id,
        email: record.email,
        modules: parseField(record.modules),
        permissions: parseField(record.permissions),
        updated_by: record.updated_by,
        created: currentDateTime,
        updated: currentDateTime,
      };
    } catch (error) {
      this.logger.error(`Error creating permission: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getPermissionByEmail(email: string) {
    try {
      this.logger.log(`Fetching permission for email: ${email}`);

      // Mandatory admin authentication for read operations too
      const adminEmail = process.env.POCKETBASE_ADMIN_EMAIL;
      const adminPassword = process.env.POCKETBASE_ADMIN_PASSWORD;
      
      if (!adminEmail || !adminPassword) {
        throw new Error('POCKETBASE_ADMIN_EMAIL and POCKETBASE_ADMIN_PASSWORD environment variables are required');
      }

      try {
        await pb.admins.authWithPassword(adminEmail, adminPassword);
        this.logger.log('Authenticated as PocketBase admin');
      } catch (authError) {
        this.logger.error('Failed to authenticate as PocketBase admin:', authError.message);
        throw new Error(`PocketBase admin authentication failed: ${authError.message}`);
      }

      const records = await pb.collection('control_system').getList(1, 1, {
        filter: `email = "${email}"`,
      });

      if (records.items.length === 0) {
        return null;
      }

      const record = records.items[0];
      
      // Handle both string and object responses from PocketBase
      const parseField = (field: any) => {
        if (typeof field === 'string') {
          try {
            return JSON.parse(field);
          } catch {
            return field;
          }
        }
        return field;
      };

      return {
        id: record.id,
        email: record.email,
        modules: parseField(record.modules),
        permissions: parseField(record.permissions),
        updated_by: record.updated_by,
        created: record.created,
        updated: record.updated,
      };
    } catch (error) {
      this.logger.error(`Error fetching permission: ${error.message}`, error.stack);
      throw error;
    }
  }
} 