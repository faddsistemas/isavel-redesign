import { withBasePath } from "@/lib/base-path";
import type { NormalizedBbox } from "@/lib/hero-bbox-layout";
import type { Veiculo } from "@/lib/types";

export interface HeroSlideFraming {
  /** Índice da foto mais aberta (carro inteiro com margem). */
  photoIndex: number;
  /** Proporção largura/altura do arquivo (ex.: 1920/1440). */
  imageAspect: number;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  /** Região aproximada do carro na foto, coordenadas 0–1. */
  carBbox: NormalizedBbox;
  desktop: {
    objectPosition: string;
    /** Início da faixa da foto (0–1 da largura do hero). */
    panelStart: number;
    kenBurnsScale: number;
  };
  mobile: {
    objectPosition: string;
    /** Altura da faixa da foto em svh. */
    bandSvh: number;
    kenBurnsScale: number;
  };
}

export function bboxFocalPosition(bbox: NormalizedBbox): string {
  const x = ((bbox.l + bbox.r) / 2) * 100;
  const y = ((bbox.t + bbox.b) / 2) * 100;
  return `${x.toFixed(1)}% ${y.toFixed(1)}%`;
}

const NATURAL_1920 = { imageNaturalWidth: 1920, imageNaturalHeight: 1440 };
const NATURAL_1290 = { imageNaturalWidth: 1290, imageNaturalHeight: 966 };
const ASPECT_1920 = NATURAL_1920.imageNaturalWidth / NATURAL_1920.imageNaturalHeight;
function frame(
  partial: Omit<HeroSlideFraming, "desktop" | "mobile" | "imageAspect" | "imageNaturalWidth" | "imageNaturalHeight"> & {
    imageAspect?: number;
    imageNaturalWidth?: number;
    imageNaturalHeight?: number;
    desktop?: Partial<HeroSlideFraming["desktop"]>;
    mobile?: Partial<HeroSlideFraming["mobile"]>;
  },
): HeroSlideFraming {
  const focal = bboxFocalPosition(partial.carBbox);
  const dims =
    partial.imageNaturalWidth != null && partial.imageNaturalHeight != null
      ? {
          imageNaturalWidth: partial.imageNaturalWidth,
          imageNaturalHeight: partial.imageNaturalHeight,
          imageAspect: partial.imageNaturalWidth / partial.imageNaturalHeight,
        }
      : { ...NATURAL_1920, imageAspect: ASPECT_1920 };
  return {
    ...partial,
    ...dims,
    desktop: {
      objectPosition: focal,
      panelStart: 0.32,
      kenBurnsScale: 1.03,
      ...partial.desktop,
    },
    mobile: {
      objectPosition: focal,
      bandSvh: 65,
      kenBurnsScale: 1,
      ...partial.mobile,
    },
  };
}

const BY_ID: Record<number, HeroSlideFraming> = {
  1024455: frame({
    photoIndex: 2,
    carBbox: { l: 0.08, t: 0.2, r: 0.86, b: 0.82 },
  }),
  1160040: frame({
    photoIndex: 2,
    carBbox: { l: 0.08, t: 0.2, r: 0.86, b: 0.82 },
  }),
  1029170: frame({
    photoIndex: 2,
    carBbox: { l: 0.08, t: 0.16, r: 0.9, b: 0.82 },
    desktop: { panelStart: 0.3 },
  }),
  1056873: frame({
    photoIndex: 2,
    carBbox: { l: 0.1, t: 0.18, r: 0.88, b: 0.8 },
    desktop: { panelStart: 0.3 },
  }),
  1004365: frame({
    photoIndex: 2,
    ...NATURAL_1290,
    carBbox: { l: 0.08, t: 0.15, r: 0.88, b: 0.88 },
    desktop: { panelStart: 0.34 },
  }),
  1161984: frame({
    photoIndex: 5,
    ...NATURAL_1290,
    carBbox: { l: 0.08, t: 0.14, r: 0.86, b: 0.87 },
    desktop: { panelStart: 0.34 },
  }),
};

const BY_MODEL: Record<string, HeroSlideFraming> = {
  hilux: BY_ID[1024455]!,
  toro: BY_ID[1029170]!,
  tiguan: BY_ID[1004365]!,
  compass: BY_ID[1161984]!,
};

const DEFAULT: HeroSlideFraming = frame({
  photoIndex: 0,
  carBbox: { l: 0.08, t: 0.12, r: 0.92, b: 0.88 },
  desktop: { kenBurnsScale: 1.02, panelStart: 0.32 },
});

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
    framing.desktop.panelStart.toFixed(3),
  ].join("|");
}