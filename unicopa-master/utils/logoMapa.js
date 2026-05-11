export function getLogo(nome) {
  if (!nome) {
    return require("../assets/icon.png");
  }

  const map = {
    BRA: "brazil",
    ARG: "argentina",
    GER: "germany",
  };

  const key = map[nome.toUpperCase()] || nome.toLowerCase();

  return logoMap[key] || require("../assets/icon.png");
}