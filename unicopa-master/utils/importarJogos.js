import { supabase } from './supabase';
import dados from '../assets/dados.json';

export async function importarJogos() {
  const jogos = dados.jogos.map(j => ({
    id: j.id,
    fase: j.fase,
    grupo: j.grupo,
    data_et: j.data_et,
    hora_et: j.hora_et,
    data_brasilia: j.data_brasilia,
    hora_brasilia: j.hora_brasilia,
    time_casa: j.time_casa,
    sigla_casa: j.sigla_casa,
    time_fora: j.time_fora,
    sigla_fora: j.sigla_fora,
    confronto: j.confronto,
    estadio: j.estadio,
    cidade: j.cidade,
    pais: j.pais,
  }));

  const { error } = await supabase
    .from('jogos')
    .upsert(jogos, { onConflict: 'id' });

  if (error) {
    return { sucesso: false, mensagem: `Erro: ${error.message}` };
  }

  return { sucesso: true, mensagem: `${jogos.length} jogos importados com sucesso!` };
}