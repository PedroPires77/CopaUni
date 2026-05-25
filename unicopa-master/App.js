import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, SectionList, TouchableOpacity } from 'react-native';
import GameCard from './components/GameCard';
import { sortByHoraBrasilia } from './utils/sort';
import { formatDateBR } from './utils/data';
import { importarJogos } from './utils/importarJogos';
import dados from './assets/dados.json';

export default function App() {

  const [jogos, setJogos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [mensagemImport, setMensagemImport] = useState('');
  const [importando, setImportando] = useState(false);

  useEffect(() => {
    setJogos(dados.jogos);
  }, []);

  const hoje = new Date();
  const hojeStr = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;

  const grupos = [...new Set(dados.jogos.map(j => j.grupo))].sort();

  const toggleGrupo = (grupo) => {
    setGrupoSelecionado(prev => prev === grupo ? null : grupo);
  };

  const toggleFavorito = (id) => {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleImportar = async () => {
    setImportando(true);
    setMensagemImport('');
    const resultado = await importarJogos();
    setMensagemImport(resultado.mensagem);
    setImportando(false);
  };

  const agruparPorData = (jogos) => {
    return jogos.reduce((acc, jogo) => {
      const data = jogo.data_brasilia;
      if (!acc[data]) {
        acc[data] = [];
      }
      acc[data].push(jogo);
      return acc;
    }, {});
  };

  const jogosFiltrados = grupoSelecionado
    ? jogos.filter(j => j.grupo === grupoSelecionado)
    : jogos;

  const jogosAgrupados = agruparPorData(jogosFiltrados);

  const jogosTratados = Object.keys(jogosAgrupados)
    .sort()
    .map(data => ({
      title: data,
      dataFormatada: formatDateBR(data),
      data: sortByHoraBrasilia(jogosAgrupados[data]),
      isHoje: data === hojeStr,
    }));

  return (
    <ImageBackground
      style={styles.container}
      source={require('./assets/bg-overlay.png')}
    >
      <Image
        style={styles.logo}
        source={require('./assets/unicopa.png')}
      />

      <Text style={styles.title}>CALENDÁRIO</Text>

      <TouchableOpacity
        style={[styles.botaoImport, importando && styles.botaoImportando]}
        onPress={handleImportar}
        disabled={importando}
      >
        <Text style={styles.botaoImportTexto}>
          {importando ? 'Importando...' : '⬆ Importar jogos para o banco'}
        </Text>
      </TouchableOpacity>

      {mensagemImport !== '' && (
        <View style={[
          styles.mensagemContainer,
          mensagemImport.startsWith('Erro') ? styles.mensagemErro : styles.mensagemSucesso
        ]}>
          <Text style={styles.mensagemTexto}>{mensagemImport}</Text>
        </View>
      )}

      <View style={styles.filtroContainer}>
        {grupos.map(grupo => (
          <TouchableOpacity
            key={grupo}
            style={[styles.filtroBotao, grupoSelecionado === grupo && styles.filtroBotaoAtivo]}
            onPress={() => toggleGrupo(grupo)}
          >
            <Text style={[styles.filtroTexto, grupoSelecionado === grupo && styles.filtroTextoAtivo]}>
              {grupo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionList
        style={styles.lista}
        sections={jogosTratados}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={() => null}
        renderSectionHeader={({ section }) => (
          <View style={[styles.card, section.isHoje && styles.cardHoje]}>
            <View style={styles.dataContainer}>
              <Text style={styles.data}>{section.dataFormatada}</Text>
              {section.isHoje && (
                <View style={styles.badgeHoje}>
                  <Text style={styles.badgeHojeTexto}>HOJE</Text>
                </View>
              )}
            </View>
            {section.data.map((jogo) => (
              <GameCard
                key={jogo.id}
                game={jogo}
                isFavorito={favoritos.includes(jogo.id)}
                onToggleFavorito={() => toggleFavorito(jogo.id)}
              />
            ))}
          </View>
        )}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#040b13',
    alignItems: 'center',
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 2,
  },
  lista: {
    width: '100%',
  },
  card: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#0c1b2a',
    borderRadius: 12,
    padding: 15,
  },
  cardHoje: {
    borderWidth: 2,
    borderColor: '#f2cc2f',
    backgroundColor: '#111f2e',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  data: {
    color: '#f2cc2f',
    fontSize: 22,
    fontWeight: 'bold',
  },
  badgeHoje: {
    backgroundColor: '#f2cc2f',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeHojeTexto: {
    color: '#040b13',
    fontSize: 11,
    fontWeight: 'bold',
  },
  filtroContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  filtroBotao: {
    borderWidth: 1,
    borderColor: '#f2cc2f',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  filtroBotaoAtivo: {
    backgroundColor: '#f2cc2f',
  },
  filtroTexto: {
    color: '#f2cc2f',
    fontSize: 13,
    fontWeight: 'bold',
  },
  filtroTextoAtivo: {
    color: '#040b13',
  },
  botaoImport: {
    marginTop: 12,
    backgroundColor: '#1a2f45',
    borderWidth: 1,
    borderColor: '#f2cc2f',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  botaoImportando: {
    opacity: 0.5,
  },
  botaoImportTexto: {
    color: '#f2cc2f',
    fontWeight: 'bold',
    fontSize: 13,
  },
  mensagemContainer: {
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mensagemSucesso: {
    backgroundColor: '#0a2a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#009c3b',
  },
  mensagemErro: {
    backgroundColor: '#2a0a0a',
    borderLeftWidth: 4,
    borderLeftColor: '#cc3333',
  },
  mensagemTexto: {
    color: 'white',
    fontSize: 12,
  },
});