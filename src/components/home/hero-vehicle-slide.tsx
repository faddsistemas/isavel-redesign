import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HeroSlideFraming } from "@/lib/hero-slide-framing";

interface HeroFullBleedSlideProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  framing: HeroSlideFraming;
  kenBurns?: boolean;
}

/** Foto full-bleed estilo Porsche: object-cover, sem moldura/caixa. */
export function HeroFullBleedSlide({
  src,
  alt,
  sizes,
  priority,
  framing,
  kenBurns,
}: HeroFullBleedSlideProps) {
  const canvasScale = framing.canvasScale ?? 1;
  const expand = ((canvasScale - 1) / 2) * 100;

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      data-testid="hero-slide-media"
    >
      <div
        className={cn(
          "absolute",
          kenBurns && "hero-ken-burns-cover motion-reduce:transform-none",
        )}
        style={{
          top: `-${expand}%`,
          left: `-${expand}%`,
          width: `${canvasScale * 100}%`,
          height: `${canvasScale * 100}%`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          data-testid="hero-slide-image"
          className="object-cover"
          style={{ objectPosition: framing.objectPosition }}
        />
      </div>
    </div>
  );
}