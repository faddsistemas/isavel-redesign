import { withBasePath } from "@/lib/base-path";
import type { NormalizedBbox } from "@/lib/hero-bbox-layout";
import type { Veiculo } from "@/lib/types";

export interface HeroSlideFraming {
  /** Índice da foto mais aberta (carro inteiro com margem). */
  photoIndex: number;
  /** Proporção largura/altura do arquivo (ex.: 1920/1440). */
  imageAspect: number;
  /** Região aproximada do carro na foto, coordenadas 0–1. */
  carBbox: NormalizedBbox;
  desktop: {
    objectPosition: string;
    kenBurnsScale: number;
  };
  mobile: {
    objectPosition: string;
    /** Altura da faixa da foto em svh (resto = gradiente + texto). */
    bandSvh: number;
    kenBurnsScale: number;
  };
}

const ASPECT_1920 = 1920 / 1440;
const ASPECT_1290 = 1290 / 966;

const BY_ID: Record<number, HeroSlideFraming> = {
  1024455: {
    photoIndex: 2,
    imageAspect: ASPECT_1920,
    carBbox: { l: 0.05, t: 0.16, r: 0.94, b: 0.8 },
    desktop: { objectPosition: "80% 40%", kenBurnsScale: 1.03 },
    mobile: { objectPosition: "50% 48%", bandSvh: 54, kenBurnsScale: 1 },
  },
  1160040: {
    photoIndex: 2,
    imageAspect: ASPECT_1920,
    carBbox: { l: 0.05, t: 0.16, r: 0.94, b: 0.8 },
    desktop: { objectPosition: "80% 40%", kenBurnsScale: 1.03 },
    mobile: { objectPosition: "50% 48%", bandSvh: 54, kenBurnsScale: 1 },
  },
  1029170: {
    photoIndex: 2,
    imageAspect: ASPECT_1920,
    carBbox: { l: 0.08, t: 0.14, r: 0.93, b: 0.82 },
    desktop: { objectPosition: "78% 38%", kenBurnsScale: 1.03 },
    mobile: { objectPosition: "50% 46%", bandSvh: 53, kenBurnsScale: 1 },
  },
  1056873: {
    photoIndex: 2,
    imageAspect: ASPECT_1920,
    carBbox: { l: 0.06, t: 0.13, r: 0.92, b: 0.84 },
    desktop: { objectPosition: "76% 38%", kenBurnsScale: 1.03 },
    mobile: { objectPosition: "50% 45%", bandSvh: 53, kenBurnsScale: 1 },
  },
  1004365: {
    photoIndex: 2,
    imageAspect: ASPECT_1290,
    carBbox: { l: 0.07, t: 0.12, r: 0.9, b: 0.83 },
    desktop: { objectPosition: "74% 36%", kenBurnsScale: 1.03 },
    mobile: { objectPosition: "50% 44%", bandSvh: 52, kenBurnsScale: 1 },
  },
  1161984: {
    photoIndex: 5,
    imageAspect: ASPECT_1290,
    carBbox: { l: 0.06, t: 0.1, r: 0.88, b: 0.82 },
    desktop: { objectPosition: "72% 36%", kenBurnsScale: 1.03 },
    mobile: { objectPosition: "48% 42%", bandSvh: 52, kenBurnsScale: 1 },
  },
};

const BY_MODEL: Record<string, HeroSlideFraming> = {
  hilux: BY_ID[1024455]!,
  toro: BY_ID[1029170]!,
  tiguan: BY_ID[1004365]!,
  compass: BY_ID[1161984]!,
};

const DEFAULT: HeroSlideFraming = {
  photoIndex: 0,
  imageAspect: ASPECT_1920,
  carBbox: { l: 0.08, t: 0.12, r: 0.92, b: 0.88 },
  desktop: { objectPosition: "58% 50%", kenBurnsScale: 1.02 },
  mobile: { objectPosition: "50% 45%", bandSvh: 52, kenBurnsScale: 1 },
};

function modelKey(modelo: string): string {
  const m = modelo.toLowerCase();
  if (m.includes("hilux")) return "hilux";
  if (m.includes("toro")) return "toro";
  if (m.includes("tiguan")) return "tiguan";
  if (m.includes("compass")) return "compass";
  return m;
}

export function getHeroSlideFraming(vehicle: Veiculo): HeroSlideFraming {
  return (
    BY_ID[vehicle.id] ??
    BY_MODEL[modelKey(vehicle.modelo)] ?? {
      ...DEFAULT,
    }
  );
}

export function heroSlideImagePath(
  vehicle: Veiculo,
  framing?: HeroSlideFraming,
): string {
  const frame = framing ?? getHeroSlideFraming(vehicle);
  return withBasePath(`/vehicles/${vehicle.id}/${frame.photoIndex}.jpg`);
}

export function heroFramingDataset(framing: HeroSlideFraming): string {
  const { carBbox } = framing;
  return [
    framing.imageAspect.toFixed(4),
    [carBbox.l, carBbox.t, carBbox.r, carBbox.b].join(","),
    framing.desktop.objectPosition,
    framing.mobile.objectPosition,
    String(framing.mobile.bandSvh),
  ].join("|");
}