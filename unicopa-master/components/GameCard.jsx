import { View, Text, Image, StyleSheet } from 'react-native';
import { getFlag } from '../utils/logoMapa';

const isBrazilGame = (game) =>
  game.sigla_casa === 'BRA' || game.sigla_fora === 'BRA';

export default function GameCard({ game }) {
  const isBRA = isBrazilGame(game);

  return (
    <View style={[styles.jogo, isBRA && styles.jogoBrasil]}>

      {isBRA && (
        <Text style={styles.destaqueBrasil}>🇧🇷 JOGO DO BRASIL</Text>
      )}

      <Text style={styles.grupo}>
        GRUPO {game.grupo}  {game.confronto}
      </Text>

      <View style={styles.linhaPrincipal}>

        <View style={styles.time}>
          <Image
            style={styles.bandeira}
            source={getFlag(game.sigla_casa)}
          />
          <Text style={[styles.sigla, isBRA && game.sigla_casa === 'BRA' && styles.siglaBrasil]}>
            {game.sigla_casa}
          </Text>
        </View>

        <View style={styles.horario}>
          <Text style={styles.hora}>{game.hora_brasilia}</Text>
          <Text style={styles.subTitulo}>VS</Text>
        </View>

        <View style={styles.time}>
          <Text style={[styles.sigla, isBRA && game.sigla_fora === 'BRA' && styles.siglaBrasil]}>
            {game.sigla_fora}
          </Text>
          <Image
            style={styles.bandeira}
            source={getFlag(game.sigla_fora)}
          />
        </View>

      </View>

      <View style={styles.local}>
        <Text style={styles.subTitulo}>{game.estadio}</Text>
        <Text style={styles.subTitulo}>
          {game.cidade} • {game.pais}
        </Text>
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
  grupo: {
    color: '#8fa3b8',
    fontSize: 12,
    marginBottom: 10,
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
  },
  bandeira: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
  },
  hora: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  local: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subTitulo: {
    color: '#8fa3b8',
    fontSize: 12,
  },
});
