export function formatDateBR(date) {
  if (!date) return "";

  const [year, month, day] = date.split("-");

  return `${day}/${month}`;
}