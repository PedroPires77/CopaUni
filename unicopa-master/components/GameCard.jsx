import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getFlag } from '../utils/logoMapa';

const isBrazilGame = (game) =>
  game.sigla_casa === 'BRA' || game.sigla_fora === 'BRA';

export default function GameCard({ game, isFavorito, onToggleFavorito }) {
  const isBRA = isBrazilGame(game);

  return (
    <View style={[styles.jogo, isBRA && styles.jogoBrasil]}>

      {isBRA && (
        <Text style={styles.destaqueBrasil}>🇧🇷 JOGO DO BRASIL</Text>
      )}

      <View style={styles.cabecalho}>
        <Text style={styles.grupo}>
          GRUPO {game.grupo}{'  '}{game.confronto}
        </Text>
        <TouchableOpacity onPress={onToggleFavorito} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[styles.coracao, isFavorito && styles.coracaoAtivo]}>
            {isFavorito ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.linhaPrincipal}>

        <View style={styles.time}>
          <Image style={styles.bandeira} source={getFlag(game.sigla_casa)} />
          <Text style={[styles.sigla, isBRA && game.sigla_casa === 'BRA' && styles.siglaBrasil]}>
            {game.sigla_casa}
          </Text>
        </View>

        <View style={styles.horario}>
          <Text style={styles.hora}>{game.hora_brasilia}</Text>
          <Text style={styles.vs}>VS</Text>
        </View>

        <View style={[styles.time, styles.timeDireita]}>
          <Text style={[styles.sigla, isBRA && game.sigla_fora === 'BRA' && styles.siglaBrasil]}>
            {game.sigla_fora}
          </Text>
          <Image style={styles.bandeira} source={getFlag(game.sigla_fora)} />
        </View>

      </View>

      <View style={styles.local}>
        <Text style={styles.subTitulo}>{game.estadio}</Text>
        <Text style={styles.subTitulo}>{game.cidade} • {game.pais}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  jogo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d3d',
    paddingBottom: 15,
  },
  jogoBrasil: {
    backgroundColor: '#0a2a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#009c3b',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  destaqueBrasil: {
    color: '#009c3b',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  grupo: {
    color: '#8fa3b8',
    fontSize: 11,
    fontWeight: '600',
    flexShrink: 1,
    marginRight: 8,
  },
  coracao: {
    fontSize: 20,
    color: '#8fa3b8',
  },
  coracaoAtivo: {
    color: '#f2cc2f',
  },
  linhaPrincipal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  timeDireita: {
    justifyContent: 'flex-end',
  },
  bandeira: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  sigla: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  siglaBrasil: {
    color: '#ffdf00',
  },
  horario: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  hora: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vs: {
    color: '#8fa3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  local: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTitulo: {
    color: '#8fa3b8',
    fontSize: 11,
  },
});
