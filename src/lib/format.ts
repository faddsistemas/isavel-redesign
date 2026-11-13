export function formatPreco(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatKm(km: number): string {
  return `${km.toLocaleString("pt-BR")} km`;
}

export function formatAno(fab: string, mod: string): string {
  if (fab === mod) return fab;
  return `${fab}/${mod}`;
}
