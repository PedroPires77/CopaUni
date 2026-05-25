import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vlgogxnnqkqivwisxcrg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iG0TNkbCgninZVGx-_bcQg_gAJVky3f';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })