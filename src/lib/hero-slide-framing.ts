import { withBasePath } from "@/lib/base-path";
import type { Veiculo } from "@/lib/types";

export interface HeroSlideFraming {
  objectPosition: string;
  /** >1 amplia a área do cover (mostra mais do carro) sem moldura. */
  canvasScale?: number;
  photoIndex?: number;
}

const BY_ID: Record<number, HeroSlideFraming> = {
  1024455: { objectPosition: "72% 46%", canvasScale: 1.16 },
  1160040: { objectPosition: "72% 46%", canvasScale: 1.16 },
  1029170: { objectPosition: "68% 44%", canvasScale: 1.14 },
  1056873: { objectPosition: "68% 44%", canvasScale: 1.14 },
  1004365: { objectPosition: "56% 50%", canvasScale: 1.1 },
  1161984: { objectPosition: "58% 52%", canvasScale: 1.1 },
};

const BY_MODEL: Record<string, HeroSlideFraming> = {
  hilux: { objectPosition: "72% 46%", canvasScale: 1.16 },
  toro: { objectPosition: "68% 44%", canvasScale: 1.14 },
  tiguan: { objectPosition: "56% 50%", canvasScale: 1.1 },
  compass: { objectPosition: "58% 52%", canvasScale: 1.1 },
};

const DEFAULT: HeroSlideFraming = {
  objectPosition: "60% 48%",
  canvasScale: 1.08,
};

export function getHeroSlideFraming(vehicle: Veiculo): HeroSlideFraming {
  const modelKey = vehicle.modelo.toLowerCase();
  return (
    BY_ID[vehicle.id] ??
    BY_MODEL[modelKey] ?? {
      ...DEFAULT,
    }
  );
}

export function heroSlideImagePath(
  vehicle: Veiculo,
  framing?: HeroSlideFraming,
): string {
  const frame = framing ?? getHeroSlideFraming(vehicle);
  const index = frame.photoIndex ?? 0;
  return withBasePath(`/vehicles/${vehicle.id}/${index}.jpg`);
}