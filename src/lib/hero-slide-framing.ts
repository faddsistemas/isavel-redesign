import { withBasePath } from "@/lib/base-path";
import type { NormalizedBbox } from "@/lib/hero-bbox-layout";
import type { Veiculo } from "@/lib/types";

export interface HeroSlideFraming {
  /** Índice da foto desktop (side / Porsche). */
  photoIndex: number;
  imageAspect: number;
  imageNaturalWidth: number;
  imageNaturalHeight: number;
  /** Bbox na foto desktop. */
  carBbox: NormalizedBbox;
  /** Foto dedicada ao hero mobile (ângulo mais fechado). */
  mobileHero: {
    photoIndex: number;
    carBbox: NormalizedBbox;
    imageNaturalWidth: number;
    imageNaturalHeight: number;
    /** Fade extra na base quando o teto fica abaixo de ~50svh. */
    longFade?: boolean;
  };
  desktop: {
    objectPosition: string;
    panelStart: number;
    kenBurnsScale: number;
  };
  mobile: {
    objectPosition: string;
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
const MOBILE_FRONT_1920 = {
  photoIndex: 1,
  carBbox: { l: 0.14, t: 0.16, r: 0.86, b: 0.88 } as NormalizedBbox,
  ...NATURAL_1920,
};
const MOBILE_TIGUAN_1290 = {
  photoIndex: 0,
  carBbox: { l: 0.14, t: 0.2, r: 0.86, b: 0.82 } as NormalizedBbox,
  ...NATURAL_1290,
};
const MOBILE_COMPASS_1290 = {
  photoIndex: 0,
  carBbox: { l: 0.12, t: 0.18, r: 0.88, b: 0.82 } as NormalizedBbox,
  imageNaturalWidth: 1290,
  imageNaturalHeight: 954,
};

function frame(
  partial: Pick<HeroSlideFraming, "photoIndex" | "carBbox"> & {
    imageNaturalWidth?: number;
    imageNaturalHeight?: number;
    mobileHero?: HeroSlideFraming["mobileHero"];
    desktop?: Partial<HeroSlideFraming["desktop"]>;
    mobile?: Partial<HeroSlideFraming["mobile"]>;
  },
): HeroSlideFraming {
  const focalDesktop = bboxFocalPosition(partial.carBbox);
  const mobileHero = partial.mobileHero ?? {
    photoIndex: partial.photoIndex,
    carBbox: partial.carBbox,
    imageNaturalWidth: partial.imageNaturalWidth ?? NATURAL_1920.imageNaturalWidth,
    imageNaturalHeight: partial.imageNaturalHeight ?? NATURAL_1920.imageNaturalHeight,
  };
  const focalMobile = bboxFocalPosition(mobileHero.carBbox);
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
    mobileHero,
    desktop: {
      objectPosition: focalDesktop,
      panelStart: 0.32,
      kenBurnsScale: 1.03,
      ...partial.desktop,
    },
    mobile: {
      objectPosition: focalMobile,
      bandSvh: 62,
      kenBurnsScale: 1,
      ...partial.mobile,
    },
  };
}

const BY_ID: Record<number, HeroSlideFraming> = {
  1024455: frame({
    photoIndex: 2,
    carBbox: { l: 0.08, t: 0.2, r: 0.86, b: 0.82 },
    mobileHero: { ...MOBILE_FRONT_1920 },
  }),
  1160040: frame({
    photoIndex: 2,
    carBbox: { l: 0.08, t: 0.2, r: 0.86, b: 0.82 },
    mobileHero: { ...MOBILE_FRONT_1920 },
  }),
  1029170: frame({
    photoIndex: 2,
    carBbox: { l: 0.08, t: 0.16, r: 0.9, b: 0.82 },
    desktop: { panelStart: 0.3 },
    mobileHero: {
      photoIndex: 1,
      carBbox: { l: 0.12, t: 0.14, r: 0.88, b: 0.87 },
      ...NATURAL_1920,
    },
  }),
  1056873: frame({
    photoIndex: 2,
    carBbox: { l: 0.1, t: 0.18, r: 0.88, b: 0.8 },
    desktop: { panelStart: 0.3 },
    mobileHero: {
      photoIndex: 1,
      carBbox: { l: 0.12, t: 0.14, r: 0.88, b: 0.87 },
      imageNaturalWidth: 1600,
      imageNaturalHeight: 1200,
    },
  }),
  1004365: frame({
    photoIndex: 2,
    ...NATURAL_1920,
    carBbox: { l: 0.08, t: 0.15, r: 0.88, b: 0.88 },
    desktop: { panelStart: 0.34 },
    mobileHero: { ...MOBILE_TIGUAN_1290 },
  }),
  1161984: frame({
    photoIndex: 5,
    ...NATURAL_1290,
    carBbox: { l: 0.08, t: 0.14, r: 0.86, b: 0.87 },
    desktop: { panelStart: 0.34 },
    mobileHero: { ...MOBILE_COMPASS_1290 },
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
  mobileHero: { ...MOBILE_FRONT_1920, photoIndex: 0 },
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
  const f = framing ?? getHeroSlideFraming(vehicle);
  return withBasePath(`/vehicles/${vehicle.id}/${f.photoIndex}.jpg`);
}

export function heroSlideMobileImagePath(
  vehicle: Veiculo,
  framing?: HeroSlideFraming,
): string {
  const f = framing ?? getHeroSlideFraming(vehicle);
  return withBasePath(
    `/vehicles/${vehicle.id}/${f.mobileHero.photoIndex}.jpg`,
  );
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

/** Dataset no painel mobile (foto + bbox mobile). */
export function heroFramingDatasetMobile(framing: HeroSlideFraming): string {
  const m = framing.mobileHero;
  const aspect = m.imageNaturalWidth / m.imageNaturalHeight;
  return [
    aspect.toFixed(4),
    [m.carBbox.l, m.carBbox.t, m.carBbox.r, m.carBbox.b].join(","),
    framing.desktop.objectPosition,
    framing.mobile.objectPosition,
    String(framing.mobile.bandSvh),
    framing.desktop.panelStart.toFixed(3),
  ].join("|");
}