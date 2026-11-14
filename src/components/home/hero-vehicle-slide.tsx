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

/** Cover com máscara suave (Porsche): carro inteiro, sem bordas duras. */
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
  const desktopPanelStart = `${framing.desktop.panelStart * 100}%`;

  return (
    <div
      className="absolute inset-0 bg-[#0a1628]"
      data-testid="hero-slide-media"
      data-hero-framing={heroFramingDataset(framing)}
    >
      <div
        className="hero-photo-pane-desktop absolute inset-y-0 right-0 hidden sm:block"
        style={{ left: desktopPanelStart }}
        data-hero-layout="desktop"
        data-hero-soft-edge="true"
      >
        <MotionPad kenBurns={desktopKen}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            data-testid="hero-slide-image"
            className="object-cover"
            style={{ objectPosition: framing.desktop.objectPosition }}
          />
        </MotionPad>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a1628]/45 via-transparent to-[#0a1628]/35"
          aria-hidden
        />
      </div>

      <div
        className="hero-photo-pane-mobile absolute inset-x-0 top-0 sm:hidden"
        style={{ height: `${framing.mobile.bandSvh}svh` }}
        data-hero-layout="mobile"
        data-hero-soft-edge="true"
      >
        <MotionPad kenBurns={undefined}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            priority={priority}
            data-testid="hero-slide-image"
            className="object-cover"
            style={{ objectPosition: framing.mobile.objectPosition }}
          />
        </MotionPad>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#0a1628]/40 to-[#0a1628]"
          aria-hidden
        />
      </div>
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
    <div className={cn("absolute inset-0 overflow-hidden", kenBurns)}>{children}</div>
  );
}