import { createClient } from '@supabase/supabase-js';

// Hardcoded values for development only - in production these would be environment variables
const supabaseUrl = 'https://hvhhqkjmdncrigejtvhh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGhxa2ptZG5jcmlnZWp0dmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MzY0MjMsImV4cCI6MjA2MjQxMjQyM30.7O5mpiENcbPwONrlmLvpxIv8TrV8xK7--jVWg6tKdHM';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
