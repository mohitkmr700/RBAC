import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { supabase } from '../supabase/supabase.client';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';

dotenv.config();

@Injectable()
export class AuthService {
  async signup(dto: SignupDto) {
    const { email, password, full_name, role, mobile } = dto;

    if (!email || !password) {
      throw new Error('Email and Password are required');
    }

    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('🟩 Supabase signupData:', signupData);
    console.log('🟥 Supabase signupError:', signupError);

    if (signupError) {
      throw new Error(`Signup failed: ${signupError.message}`);
    }

    const userId = signupData?.user?.id;
    if (!userId) {
      throw new Error('User ID is missing after signup');
    }

    const { data: profileData, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          fullname: full_name,
          role,
          phone: mobile,
          email,
        },
      ])
      .select();

    console.log('🟨 Inserted profileData:', profileData);
    console.log('🟥 Insert profile error:', insertError);

    if (insertError) {
      throw new Error(`Error inserting user profile: ${insertError.message}`);
    }

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      throw new Error(`Login failed: ${loginError.message}`);
    }

    const accessToken = loginData?.session?.access_token;
    if (!accessToken) {
      throw new Error('Access token missing after login');
    }

    return {
      message: 'User signed up and logged in successfully.',
      accessToken,
      user: loginData?.user,
      profile: profileData,
    };
  }

  // auth.service.ts

async login(loginDto: { email: string; password: string }) {
    const { email, password } = loginDto;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  
    // Fetch the user's profile data from the 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')  // Select all fields from the profile table
      .eq('id', data.user.id)
      .single();
  
    if (profileError || !profileData) {
      throw new Error(`Failed to fetch profile data: ${profileError?.message}`);
    }
  
    // Create a custom JWT token with the full profile data
    const userPayload = {
      id: data.user.id,
      email: data.user.email,
      ...profileData, // Include the entire profile data in the payload
    };
  
    const token = jwt.sign(userPayload, process.env.JWT_SECRET!, {
      expiresIn: '1h', // Set the expiration as needed
    });
  
    return {
      message: 'Login successful',
      user: userPayload,
      accessToken: token,
    };
  }
  
  
}
