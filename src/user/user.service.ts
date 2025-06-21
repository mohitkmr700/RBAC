import { Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../supabase/supabase.client';

export interface Profile {
  id: string;
  created_at: string;
  fullname: string;
  avatar_url?: string;
  role: string;
  phone?: string;
  email: string;
}

@Injectable()
export class UserService {
  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new UnauthorizedException(`Failed to fetch profiles: ${error.message}`);
    }

    return data || [];
  }

  async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new UnauthorizedException(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  async getProfilesByRole(role: string): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });

    if (error) {
      throw new UnauthorizedException(`Failed to fetch profiles by role: ${error.message}`);
    }

    return data || [];
  }
} 