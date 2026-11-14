import {
  bboxToScreenRect,
  objectCoverImageRect,
  rectInside,
  type NormalizedBbox,
} from "@/lib/hero-bbox-layout";
import { bboxFocalPosition } from "@/lib/hero-slide-framing";

const BBOX_VW = 0.96;
const MAX_MEDIA_SVH = 58;
/** Alinhado a --header-offset (barra de horário + header). */
export const MOBILE_HEADER_CLEARANCE_PX = 120;

export interface MobileHeroMediaLayout {
  /** Altura visível da faixa do carro (sem a zona sob o header). */
  mediaHeightPx: number;
  /** Mídia + respiro superior para o hero full-bleed atrás do header. */
  mediaWrapHeightPx: number;
  headerClearancePx: number;
  objectPosition: string;
  /** Teto rígido (boxH máximo com cover sem cortar largura do bbox). */
  ceilingHeightPx: number;
}

function carBboxScreenTop(
  boxW: number,
  boxH: number,
  imageAspect: number,
  objectPosition: string,
  bbox: NormalizedBbox,
): number {
  const imageRect = objectCoverImageRect(
    { width: boxW, height: boxH },
    imageAspect,
    objectPosition,
  );
  const car = bboxToScreenRect(bbox, imageRect);
  return car.top;
}

function bboxFitsCoverBox(
  boxW: number,
  boxH: number,
  imageAspect: number,
  objectPosition: string,
  bbox: NormalizedBbox,
  tolerance = 1,
): boolean {
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

/** Desloca o cover para o teto do bbox ficar abaixo da pilha do header. */
export function mobileObjectPositionWithHeaderClearance(
  boxW: number,
  boxH: number,
  imageNaturalWidth: number,
  imageNaturalHeight: number,
  bbox: NormalizedBbox,
  clearanceTopPx: number,
): string {
  const imageAspect = imageNaturalWidth / imageNaturalHeight;
  const focalX = ((bbox.l + bbox.r) / 2) * 100;
  const focalY = (bbox.t + bbox.b) / 2;

  const formatPos = (y: number) =>
    `${focalX.toFixed(1)}% ${(y * 100).toFixed(1)}%`;

  const ok = (y: number) => {
    const pos = formatPos(y);
    if (!bboxFitsCoverBox(boxW, boxH, imageAspect, pos, bbox)) return false;
    return carBboxScreenTop(boxW, boxH, imageAspect, pos, bbox) >= clearanceTopPx - 1;
  };

  for (let y = 1; y >= 0; y -= 0.02) {
    if (ok(y)) return formatPos(y);
  }

  return bboxFocalPosition(bbox);
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
  headerClearancePx = MOBILE_HEADER_CLEARANCE_PX,
): MobileHeroMediaLayout {
  const ceilingHeightPx = mobileCoverWidthCeilingPx(
    viewportWidth,
    imageNaturalWidth,
    imageNaturalHeight,
    bbox,
  );
  const capSvh = (MAX_MEDIA_SVH / 100) * svhPx;
  const floorPx = Math.min(ceilingHeightPx, capSvh);
  /** Pilha horário+header em px; hero-mobile usa ~5px abaixo disso com -mt. */
  const headerStackPx = headerClearancePx + 5;
  const carSafeTopLocalPx = headerStackPx - 5;

  let mediaHeightPx = floorPx;
  let objectPosition = mobileObjectPositionWithHeaderClearance(
    viewportWidth,
    mediaHeightPx,
    imageNaturalWidth,
    imageNaturalHeight,
    bbox,
    carSafeTopLocalPx,
  );

  const positionClearsHeader = (boxH: number, pos: string) => {
    const imageAspect = imageNaturalWidth / imageNaturalHeight;
    const imageRect = objectCoverImageRect(
      { width: viewportWidth, height: boxH },
      imageAspect,
      pos,
    );
    const car = bboxToScreenRect(bbox, imageRect);
    const viewportCarTop = car.top + headerClearancePx - (headerClearancePx - 5);
    return (
      car.top >= carSafeTopLocalPx - 1 &&
      viewportCarTop >= headerStackPx - 1
    );
  };

  while (
    mediaHeightPx + 8 <= capSvh + 0.5 &&
    !positionClearsHeader(mediaHeightPx, objectPosition)
  ) {
    mediaHeightPx += 8;
    objectPosition = mobileObjectPositionWithHeaderClearance(
      viewportWidth,
      mediaHeightPx,
      imageNaturalWidth,
      imageNaturalHeight,
      bbox,
      carSafeTopLocalPx,
    );
  }

  const mediaWrapHeightPx = mediaHeightPx + headerClearancePx;

  return {
    mediaHeightPx: Math.round(mediaHeightPx),
    mediaWrapHeightPx: Math.round(mediaWrapHeightPx),
    headerClearancePx,
    objectPosition,
    ceilingHeightPx,
  };
}