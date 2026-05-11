export function sortByHoraBrasilia(jogos) {
  return [...jogos].sort((a, b) => {
    const [aH, aM] = a.hora_brasilia.split(':').map(Number);
    const [bH, bM] = b.hora_brasilia.split(':').map(Number);
    return aH * 60 + aM - (bH * 60 + bM);
  });
}