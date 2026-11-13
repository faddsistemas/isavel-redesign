import vehiclesFile from "@/data/vehicles.json";
import { withBasePath } from "@/lib/base-path";
import type { StockFilters, Veiculo, VehicleRouteParams, VehiclesFile } from "@/lib/types";
import type { OrdenacaoValue } from "@/lib/constants";

const data = vehiclesFile as VehiclesFile;

export function getAllVehicles(): Veiculo[] {
  return data.veiculos;
}

export function getVehicleById(id: number): Veiculo | undefined {
  return data.veiculos.find((v) => v.id === id);
}

export function vehiclePathFromUrl(v: Veiculo): string {
  const pathname = new URL(v.url).pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function vehiclePathSegments(v: Veiculo): VehicleRouteParams {
  const parts = new URL(v.url).pathname.split("/").filter(Boolean);
  return {
    tipo: parts[0],
    marca: parts[1],
    modelo: parts[2],
    ano: parts[3],
    id: parts[4],
  };
}

export function getStaticVehicleParams(): VehicleRouteParams[] {
  return data.veiculos.map(vehiclePathSegments);
}

export function localPhotoPaths(v: Veiculo): string[] {
  return v.fotos.map((_, i) => withBasePath(`/vehicles/${v.id}/${i}.jpg`));
}

export function localCoverPath(v: Veiculo): string {
  return withBasePath(`/vehicles/${v.id}/0.jpg`);
}

export interface MarcaCount {
  marca: string;
  marca_slug: string;
  count: number;
}

export function getMarcasComEstoque(): MarcaCount[] {
  const map = new Map<string, MarcaCount>();
  for (const v of data.veiculos) {
    const cur = map.get(v.marca_slug);
    if (cur) cur.count += 1;
    else
      map.set(v.marca_slug, {
        marca: v.marca,
        marca_slug: v.marca_slug,
        count: 1,
      });
  }
  return [...map.values()].sort((a, b) => a.marca.localeCompare(b.marca, "pt-BR"));
}

export function getFilterOptions() {
  const vehicles = data.veiculos;
  const modelos = [...new Set(vehicles.map((v) => v.modelo))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
  const cambios = [...new Set(vehicles.map((v) => v.cambio))].sort();
  const combustiveis = [...new Set(vehicles.map((v) => v.combustivel))].sort();
  const lojas = [...new Set(vehicles.map((v) => v.loja))].sort();
  const tipos = [...new Set(vehicles.map((v) => v.tipo))].sort();
  const anos = vehicles.map((v) => Number(v.ano_modelo));
  const precos = vehicles.map((v) => v.preco);
  return {
    modelos,
    cambios,
    combustiveis,
    lojas,
    tipos,
    anoMin: Math.min(...anos),
    anoMax: Math.max(...anos),
    precoMin: Math.min(...precos),
    precoMax: Math.max(...precos),
  };
}

function matchesTerm(v: Veiculo, termo: string): boolean {
  const t = termo.toLowerCase().trim();
  if (!t) return true;
  const hay = `${v.marca} ${v.modelo} ${v.versao}`.toLowerCase();
  return hay.includes(t);
}

function sortVehicles(list: Veiculo[], ordenacao: OrdenacaoValue): Veiculo[] {
  const copy = [...list];
  switch (ordenacao) {
    case "marca-modelo":
      copy.sort((a, b) =>
        `${a.marca}${a.modelo}`.localeCompare(
          `${b.marca}${b.modelo}`,
          "pt-BR",
        ),
      );
      break;
    case "menor-preco":
      copy.sort((a, b) => a.preco - b.preco);
      break;
    case "maior-preco":
      copy.sort((a, b) => b.preco - a.preco);
      break;
    case "ano-novo":
      copy.sort(
        (a, b) => Number(b.ano_modelo) - Number(a.ano_modelo),
      );
      break;
    case "menor-km":
      copy.sort((a, b) => a.km - b.km);
      break;
    case "relevancia":
    default:
      copy.sort((a, b) => b.id - a.id);
      break;
  }
  return copy;
}

export function filterVehicles(filters: StockFilters): Veiculo[] {
  const ordenacao = (filters.ordenacao as OrdenacaoValue) || "relevancia";
  let list = data.veiculos.filter((v) => {
    if (filters.termo && !matchesTerm(v, filters.termo)) return false;
    if (filters.marca && v.marca_slug !== filters.marca) return false;
    if (filters.modelo && v.modelo !== filters.modelo) return false;
    if (filters.cambio && v.cambio !== filters.cambio) return false;
    if (filters.combustivel && v.combustivel !== filters.combustivel) return false;
    if (filters.loja && v.loja !== filters.loja) return false;
    if (filters.tipo && v.tipo !== filters.tipo) return false;
    if (filters.anoMin && Number(v.ano_modelo) < Number(filters.anoMin))
      return false;
    if (filters.anoMax && Number(v.ano_modelo) > Number(filters.anoMax))
      return false;
    if (filters.precoMin && v.preco < Number(filters.precoMin)) return false;
    if (filters.precoMax && v.preco > Number(filters.precoMax)) return false;
    return true;
  });
  list = sortVehicles(list, ordenacao);
  return list;
}

export function getFeaturedVehicles(limit = 8): Veiculo[] {
  return sortVehicles(data.veiculos, "maior-preco").slice(0, limit);
}

export function getSameBrandSuggestions(v: Veiculo, limit = 4): Veiculo[] {
  return data.veiculos
    .filter((x) => x.marca_slug === v.marca_slug && x.id !== v.id)
    .sort((a, b) => b.preco - a.preco)
    .slice(0, limit);
}

export const VEHICLE_COUNT = data.total;
