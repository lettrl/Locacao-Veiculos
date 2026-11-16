export function formatarMoeda(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarDataHora(data) {
  if (!data) return "-";
  return new Date(data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
