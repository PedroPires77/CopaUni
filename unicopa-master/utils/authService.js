import { supabase } from './supabase';

export const login = async (email, senha) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return { sucesso: false };
  return { sucesso: true, data };
};

export const registrar = async (email, senha) => {
  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  if (error) return { sucesso: false };
  return { sucesso: true, data };
};