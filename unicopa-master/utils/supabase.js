import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vlgogxnnqkqivwisxcrg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZ29neG5ucWtxaXZ3aXN4Y3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTI5MzIsImV4cCI6MjA5NDE4ODkzMn0._Xa3aZy4-cOurXTFS_31R_OqzKRFGO5QgiIfZqIRFQM';

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