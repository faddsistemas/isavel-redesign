import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { heroFramingDataset, type HeroSlideFraming } from "@/lib/hero-slide-framing";

interface HeroFullBleedSlideProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  framing: HeroSlideFraming;
  kenBurns?: boolean;
}

/** Desktop: faixa direita com contain (carro inteiro). Mobile: topo + gradiente. */
export function HeroFullBleedSlide({
  src,
  alt,
  sizes,
  priority,
  framing,
  kenBurns,
}: HeroFullBleedSlideProps) {
  const desktopKen =
    kenBurns && framing.desktop.kenBurnsScale > 1
      ? "hero-ken-burns-contain-max motion-reduce:transform-none"
      : undefined;
  const mobileKen =
    kenBurns && framing.mobile.kenBurnsScale > 1
      ? "hero-ken-burns-contain-max motion-reduce:transform-none"
      : undefined;

  return (
    <div
      className="absolute inset-0 bg-[#0a1628]"
      data-testid="hero-slide-media"
      data-hero-framing={heroFramingDataset(framing)}
    >
      <div
        className="absolute inset-y-0 right-0 hidden left-[min(52%,36rem)] sm:block"
        data-hero-layout="desktop"
      >
        <MotionPad kenBurns={desktopKen}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            data-testid="hero-slide-image"
            className="object-contain"
            style={{ objectPosition: framing.desktop.objectPosition }}
          />
        </MotionPad>
      </div>

      <div
        className="absolute inset-x-0 top-0 sm:hidden"
        style={{ height: `${framing.mobile.bandSvh}svh` }}
        data-hero-layout="mobile"
      >
        <MotionPad kenBurns={mobileKen}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            priority={priority}
            data-testid="hero-slide-image"
            className="object-contain"
            style={{ objectPosition: framing.mobile.objectPosition }}
          />
        </MotionPad>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(28%,9rem)] bg-gradient-to-b from-transparent via-[#0a1628]/55 to-[#0a1628]"
          aria-hidden
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 bg-[#0a1628] sm:hidden"
        style={{ top: `${framing.mobile.bandSvh}svh` }}
        aria-hidden
      />
    </div>
  );
}

function MotionPad({
  children,
  kenBurns,
}: {
  children: ReactNode;
  kenBurns?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#0a1628]",
        kenBurns,
      )}
    >
      {children}
    </div>
  );
}