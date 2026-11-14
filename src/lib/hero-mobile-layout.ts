import {
  bboxToScreenRect,
  objectCoverImageRect,
  rectInside,
  type NormalizedBbox,
} from "@/lib/hero-bbox-layout";
import { bboxFocalPosition } from "@/lib/hero-slide-framing";

const BBOX_VW = 0.96;
const BREATHING = 1.3;
const MAX_MEDIA_SVH = 58;

export interface MobileHeroMediaLayout {
  mediaHeightPx: number;
  objectPosition: string;
}

export interface MobileHeroLayoutOptions {
  /** Altura máxima da mídia (ex.: 100svh menos copy/controles). */
  maxMediaPx?: number;
}

function bboxFitsCover(
  viewportWidth: number,
  mediaHeightPx: number,
  imageAspect: number,
  bbox: NormalizedBbox,
  objectPosition: string,
): boolean {
  const imageRect = objectCoverImageRect(
    { width: viewportWidth, height: mediaHeightPx },
    imageAspect,
    objectPosition,
  );
  const car = bboxToScreenRect(bbox, imageRect);
  return rectInside(
    car,
    { left: 0, top: 0, right: viewportWidth, bottom: mediaHeightPx },
    3,
  );
}

function maxHeightWithFullBbox(
  viewportWidth: number,
  imageAspect: number,
  bbox: NormalizedBbox,
  objectPosition: string,
  minH: number,
  maxH: number,
): number {
  let lo = minH;
  let hi = maxH;
  if (!bboxFitsCover(viewportWidth, hi, imageAspect, bbox, objectPosition)) {
    while (hi - lo > 2) {
      const mid = (lo + hi) / 2;
      if (bboxFitsCover(viewportWidth, mid, imageAspect, bbox, objectPosition)) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return lo;
  }
  return hi;
}

/** Altura da mídia mobile: bbox ~96vw de largura, carro inteiro visível, preenche o hero sem vão. */
export function computeMobileHeroMediaLayout(
  viewportWidth: number,
  svhPx: number,
  imageAspect: number,
  bbox: NormalizedBbox,
  options: MobileHeroLayoutOptions = {},
): MobileHeroMediaLayout {
  const objectPosition = bboxFocalPosition(bbox);
  const bboxW = Math.max(bbox.r - bbox.l, 0.08);
  const bboxH = Math.max(bbox.b - bbox.t, 0.08);

  const widthTargetH = (BBOX_VW * viewportWidth) / (bboxW * imageAspect);
  const idealH = widthTargetH * bboxH * BREATHING;
  const capSvh = (MAX_MEDIA_SVH / 100) * svhPx;
  const maxMedia =
    options.maxMediaPx != null
      ? Math.min(options.maxMediaPx, capSvh)
      : capSvh;

  let mediaHeightPx = Math.min(idealH, maxMedia);
  if (!bboxFitsCover(viewportWidth, mediaHeightPx, imageAspect, bbox, objectPosition)) {
    mediaHeightPx = maxHeightWithFullBbox(
      viewportWidth,
      imageAspect,
      bbox,
      objectPosition,
      mediaHeightPx,
      Math.max(idealH, maxMedia) * 1.2,
    );
  }

  if (mediaHeightPx < maxMedia) {
    mediaHeightPx = maxHeightWithFullBbox(
      viewportWidth,
      imageAspect,
      bbox,
      objectPosition,
      mediaHeightPx,
      maxMedia,
    );
  }

  return {
    mediaHeightPx: Math.round(mediaHeightPx),
    objectPosition,
  };
}