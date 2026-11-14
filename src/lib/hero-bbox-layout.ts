/** Geometria de object-contain + bbox normalizado (0–1) na imagem fonte. */

export interface NormalizedBbox {
  l: number;
  t: number;
  r: number;
  b: number;
}

export function parseObjectPosition(
  objectPosition: string,
): { x: number; y: number } {
  const parts = objectPosition.trim().split(/\s+/);
  const parse = (token: string | undefined, fallback: number) => {
    if (!token) return fallback;
    if (token.endsWith("%")) {
      return Number.parseFloat(token) / 100;
    }
    if (token === "left" || token === "top") return 0;
    if (token === "right" || token === "bottom") return 1;
    if (token === "center") return 0.5;
    return fallback;
  };
  return {
    x: parse(parts[0], 0.5),
    y: parse(parts[1] ?? parts[0], 0.5),
  };
}

export function objectCoverImageRect(
  container: { width: number; height: number },
  imageAspect: number,
  objectPosition: string,
): { left: number; top: number; width: number; height: number } {
  const { x, y } = parseObjectPosition(objectPosition);
  const cw = container.width;
  const ch = container.height;
  const containerAspect = cw / ch;

  if (containerAspect > imageAspect) {
    const height = ch;
    const width = ch * imageAspect;
    const overflow = width - cw;
    return { left: -overflow * x, top: 0, width, height };
  }

  const width = cw;
  const height = cw / imageAspect;
  const overflow = height - ch;
  return { left: 0, top: -overflow * y, width, height };
}

export function objectContainImageRect(
  container: { width: number; height: number },
  imageAspect: number,
  objectPosition: string,
): { left: number; top: number; width: number; height: number } {
  const { x, y } = parseObjectPosition(objectPosition);
  const cw = container.width;
  const ch = container.height;
  const containerAspect = cw / ch;

  let width: number;
  let height: number;
  if (containerAspect > imageAspect) {
    height = ch;
    width = ch * imageAspect;
  } else {
    width = cw;
    height = cw / imageAspect;
  }

  const freeX = cw - width;
  const freeY = ch - height;
  const left = freeX * x;
  const top = freeY * y;

  return { left, top, width, height };
}

export function bboxToScreenRect(
  bbox: NormalizedBbox,
  imageRect: { left: number; top: number; width: number; height: number },
): { left: number; top: number; right: number; bottom: number } {
  return {
    left: imageRect.left + bbox.l * imageRect.width,
    top: imageRect.top + bbox.t * imageRect.height,
    right: imageRect.left + bbox.r * imageRect.width,
    bottom: imageRect.top + bbox.b * imageRect.height,
  };
}

export function rectsIntersect(
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
  pad = 4,
): boolean {
  return !(
    a.right <= b.left + pad ||
    a.left >= b.right - pad ||
    a.bottom <= b.top + pad ||
    a.top >= b.bottom - pad
  );
}

export function rectInside(
  inner: { left: number; top: number; right: number; bottom: number },
  outer: { left: number; top: number; right: number; bottom: number },
  tolerance = 2,
): boolean {
  return (
    inner.left >= outer.left - tolerance &&
    inner.top >= outer.top - tolerance &&
    inner.right <= outer.right + tolerance &&
    inner.bottom <= outer.bottom + tolerance
  );
}