import { supabase } from './src/supabase/supabase.client';

async function testConnection() {
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('❌ Service Role Key error:', error.message);
  } else {
    console.log('✅ Supabase is connected. Found users:', data.users.length);
  }
}

testConnection();
