import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, FlatList, Modal, ScrollView } from 'react-native';
import { supabase } from '../utils/supabase';

const encerrado = (data, hora) => {
  const [a, m, d] = data.split('-');
  const [h, min] = hora.split(':');
  return new Date() >= new Date(a, m - 1, d, h, min);
};

export default function PalpitesScreen({ navigation }) {
  const [jogos, setJogos] = useState([]);
  const [palpites, setPalpites] = useState({});
  const [uid, setUid] = useState(null);
  const [msgs, setMsgs] = useState({});

    const [modalVisivel, setModalVisivel] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [msg, setMsg] = useState('');

  useEffect(() => {
    const carregar = async () => {
      const { data: u } = await supabase.auth.getUser();
      const id = u?.user?.id;
      setUid(id);

      const { data } = await supabase.from('jogos').select('*').order('data_brasilia').order('hora_brasilia');
      setJogos((data || []).filter(j => !j.sigla_casa.match(/^[0-9W]/)));

      if (id) {
        const { data: p } = await supabase.from('palpites').select('*').eq('id_usuario', id);
        const mapa = {};
        (p || []).forEach(x => { mapa[x.id_jogo] = { casa: String(x.placar_time_casa), fora: String(x.placar_time_fora) }; });
        setPalpites(mapa);
      }
    };
    carregar();
  }, []);

  const setVal = (id, campo, v) =>
    setPalpites(prev => ({ ...prev, [id]: { ...prev[id], [campo]: v.replace(/[^0-9]/g, '') } }));

  const palpitesPreenchidos = jogos.filter(j => {
  const p = palpites[j.id];
  return p && p.casa !== '' && p.casa != null && p.fora !== '' && p.fora != null;
});

const confirmarTodos = async () => {
  setSalvando(true);
  const payload = palpitesPreenchidos.map(j => ({
    id_usuario: uid,
    id_jogo: j.id,
    placar_time_casa: +palpites[j.id].casa,
    placar_time_fora: +palpites[j.id].fora,
  }));
  const { error } = await supabase.from('palpites').upsert(payload, { onConflict: 'id_usuario,id_jogo' });
  setSalvando(false);
  setModalVisivel(false);
  setMsg(error ? 'Erro ao salvar palpites.' : 'Palpites confirmados!');
  setTimeout(() => setMsg(''), 3000);
};

  const salvar = async (jogo) => {
    const p = palpites[jogo.id] || {};
    if (p.casa === '' || p.fora === '' || p.casa == null || p.fora == null)
      return setMsgs(m => ({ ...m, [jogo.id]: 'Preencha os dois placares.' }));

    await supabase.from('palpites').upsert(
      { id_usuario: uid, id_jogo: jogo.id, placar_time_casa: +p.casa, placar_time_fora: +p.fora },
      { onConflict: 'id_usuario,id_jogo' }
    );
    setMsgs(m => ({ ...m, [jogo.id]: 'Salvo!' }));
    setTimeout(() => setMsgs(m => ({ ...m, [jogo.id]: '' })), 2000);
  };

  return (
    <ImageBackground style={styles.bg} source={require('../assets/bg-overlay.png')}>
      <Text style={styles.titulo}>PALPITES</Text>
      {msg !== '' && (
  <View style={[styles.msgBox, msg.startsWith('Erro') ? styles.msgErro : styles.msgOk]}>
    <Text style={styles.msgTxt}>{msg}</Text>
  </View>
)}
      <FlatList
        data={jogos}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const fim = encerrado(item.data_brasilia, item.hora_brasilia);
          const p = palpites[item.id] || { casa: '', fora: '' };
          return (
            <View style={styles.card}>
              <Text style={styles.confronto}>{item.confronto}</Text>
              <Text style={styles.info}>{item.data_brasilia} • {item.hora_brasilia}</Text>
              <View style={styles.row}>
                <TextInput style={[styles.input, fim && styles.off]} value={p.casa?? ''} onChangeText={v => setVal(item.id, 'casa', v)} keyboardType="numeric" maxLength={2} editable={!fim} placeholder="0" placeholderTextColor="#4a6070" />
                <Text style={styles.x}>X</Text>
                <TextInput style={[styles.input, fim && styles.off]} value={p.fora?? ''} onChangeText={v => setVal(item.id, 'fora', v)} keyboardType="numeric" maxLength={2} editable={!fim} placeholder="0" placeholderTextColor="#4a6070" />
              </View>
              {fim
                ? <Text style={styles.enc}>Encerrado para palpites</Text>
                : <TouchableOpacity style={styles.botao} onPress={() => salvar(item)}><Text style={styles.botaoTxt}>Salvar</Text></TouchableOpacity>
              }
              {msgs[item.id] ? <Text style={[styles.msg, msgs[item.id] === 'Salvo!' && styles.ok]}>{msgs[item.id]}</Text> : null}
            </View>
          );
        }}
      />
      <TouchableOpacity
  style={[styles.botaoRevisar, palpitesPreenchidos.length === 0 && styles.off]}
  onPress={() => setModalVisivel(true)}
  disabled={palpitesPreenchidos.length === 0}
>
  <Text style={styles.botaoRevisarTxt}>Revisar {palpitesPreenchidos.length} palpite(s)</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.voltar} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarTxt}>← Voltar</Text>
      </TouchableOpacity>
      <Modal visible={modalVisivel} transparent animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitulo}>Revisar Palpites</Text>
      <ScrollView style={styles.modalLista}>
        {palpitesPreenchidos.map(j => (
          <View key={j.id} style={styles.modalItem}>
            <Text style={styles.modalConfronto}>{j.confronto}</Text>
            <Text style={styles.modalPlacar}>{palpites[j.id].casa} x {palpites[j.id].fora}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={[styles.botaoConfirmar, salvando && styles.off]} onPress={confirmarTodos} disabled={salvando}>
        <Text style={styles.botaoConfirmarTxt}>{salvando ? 'Salvando...' : 'Confirmar todos'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisivel(false)}>
        <Text style={styles.botaoCancelarTxt}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#040b13' },
  titulo: { fontSize: 26, fontWeight: '700', color: 'white', letterSpacing: 2, textAlign: 'center', marginTop: 24, marginBottom: 8 },
  lista: { paddingHorizontal: 16, paddingBottom: 32 },
  card: { backgroundColor: '#0c1b2a', borderRadius: 12, padding: 16, marginBottom: 12 },
  confronto: { color: 'white', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  info: { color: '#8fa3b8', fontSize: 11, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 10 },
  input: { backgroundColor: '#1a2f45', borderWidth: 1, borderColor: '#1e2d3d', borderRadius: 8, width: 52, height: 44, textAlign: 'center', color: 'white', fontSize: 18, fontWeight: 'bold' },
  off: { opacity: 0.4 },
  x: { color: '#8fa3b8', fontSize: 16, fontWeight: 'bold' },
  botao: { backgroundColor: '#f2cc2f', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  botaoTxt: { color: '#040b13', fontWeight: 'bold' },
  enc: { color: '#4a6070', fontSize: 11, textAlign: 'center' },
  msg: { color: '#ff6b6b', fontSize: 11, textAlign: 'center', marginTop: 4 },
  ok: { color: '#4caf50' },
  voltar: { paddingVertical: 16, alignItems: 'center' },
  voltarTxt: { color: '#f2cc2f', fontWeight: 'bold' },
  botaoRevisar: { margin: 16, backgroundColor: '#f2cc2f', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
botaoRevisarTxt: { color: '#040b13', fontWeight: 'bold', fontSize: 15 },
msgBox: { marginHorizontal: 16, borderRadius: 8, padding: 10, marginBottom: 8 },
msgOk: { backgroundColor: '#0a2a1a', borderLeftWidth: 4, borderLeftColor: '#009c3b' },
msgErro: { backgroundColor: '#2a0a0a', borderLeftWidth: 4, borderLeftColor: '#cc3333' },
msgTxt: { color: 'white', fontSize: 13 },
modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
modalBox: { backgroundColor: '#0c1b2a', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '70%' },
modalTitulo: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
modalLista: { marginBottom: 16 },
modalItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#1e2d3d' },
modalConfronto: { color: 'white', fontSize: 13, flexShrink: 1, marginRight: 8 },
modalPlacar: { color: '#f2cc2f', fontWeight: 'bold', fontSize: 16 },
botaoConfirmar: { backgroundColor: '#f2cc2f', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
botaoConfirmarTxt: { color: '#040b13', fontWeight: 'bold', fontSize: 15 },
botaoCancelar: { paddingVertical: 10, alignItems: 'center' },
botaoCancelarTxt: { color: '#8fa3b8', fontSize: 14 },
});