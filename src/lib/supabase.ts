import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://slgwxhzpkiyswfxaejmn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZ3d4aHpwa2l5c3dmeGFlam1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTc3ODksImV4cCI6MjA1Nzc5Mzc4OX0.xp18UtC96DYFTMQfJkuZF_qI41_sqIIsrsDVSLBruys';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Authentication functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
}; 