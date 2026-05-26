import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const getUsuarioId = async () => {
  let id = await AsyncStorage.getItem('usuario_id');
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem('usuario_id', id);
  }
  return id;
};

export const buscarFavoritos = async () => {
  const id_usuario = await getUsuarioId();
  const { data, error } = await supabase
    .from('favoritos')
    .select('id_jogo')
    .eq('id_usuario', id_usuario);
  if (error) return [];
  return data.map(f => f.id_jogo);
};
 
export const toggleFavoritoSupabase = async (id_jogo) => {
  const id_usuario = await getUsuarioId();
 
  const { data } = await supabase
    .from('favoritos')
    .select('id')
    .eq('id_jogo', id_jogo)
    .eq('id_usuario', id_usuario)
    .single();
 
  if (data) {
    await supabase
      .from('favoritos')
      .delete()
      .eq('id_jogo', id_jogo)
      .eq('id_usuario', id_usuario);
    return false;
  } else {
    await supabase
      .from('favoritos')
      .insert({ id_jogo, id_usuario });
    return true;
  }
};
 