import {
  bboxToScreenRect,
  objectCoverImageRect,
  rectInside,
  type NormalizedBbox,
} from "@/lib/hero-bbox-layout";
import { bboxFocalPosition } from "@/lib/hero-slide-framing";

const BBOX_VW = 0.96;
const MAX_MEDIA_SVH = 62;
const LONG_FADE_SVH = 50;

export interface MobileHeroMediaLayout {
  mediaHeightPx: number;
  objectPosition: string;
  /** Teto rígido (boxH máximo com cover sem cortar largura do bbox). */
  ceilingHeightPx: number;
  longFade: boolean;
}

/** Cover: s = max(boxW/imgW, boxH/imgH). Com regime altura, s*bboxW_px <= boxW*0.96 ⇒ boxH <= imgH*(boxW*0.96)/bboxW_px. */
export function mobileCoverWidthCeilingPx(
  boxW: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  bbox: NormalizedBbox,
): number {
  const bboxW_px = Math.max(bbox.r - bbox.l, 0.05) * imageNaturalWidth;
  return (imageNaturalHeight * (boxW * BBOX_VW)) / bboxW_px;
}

export function bboxFitsInMobileCover(
  boxW: number,
  boxH: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  bbox: NormalizedBbox,
  objectPosition: string,
  tolerance = 1,
): boolean {
  const imageAspect = imageNaturalWidth / imageNaturalHeight;
  const imageRect = objectCoverImageRect(
    { width: boxW, height: boxH },
    imageAspect,
    objectPosition,
  );
  const car = bboxToScreenRect(bbox, imageRect);
  return rectInside(
    car,
    { left: 0, top: 0, right: boxW, bottom: boxH },
    tolerance,
  );
}

/** Altura da mídia mobile: nunca acima do teto rígido de largura do bbox. */
export function computeMobileHeroMediaLayout(
  viewportWidth: number,
  svhPx: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  bbox: NormalizedBbox,
): MobileHeroMediaLayout {
  const objectPosition = bboxFocalPosition(bbox);
  const ceilingHeightPx = mobileCoverWidthCeilingPx(
    viewportWidth,
    imageNaturalWidth,
    imageNaturalHeight,
    bbox,
  );
  const capSvh = (MAX_MEDIA_SVH / 100) * svhPx;
  const mediaHeightPx = Math.min(ceilingHeightPx, capSvh);
  const longFade = mediaHeightPx < (LONG_FADE_SVH / 100) * svhPx - 2;

  return {
    mediaHeightPx: Math.round(mediaHeightPx),
    objectPosition,
    ceilingHeightPx,
    longFade,
  };
}