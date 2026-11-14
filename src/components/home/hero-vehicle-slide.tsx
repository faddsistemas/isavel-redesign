import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  heroFramingDataset,
  heroFramingDatasetMobile,
  type HeroSlideFraming,
} from "@/lib/hero-slide-framing";

interface HeroFullBleedSlideProps {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  framing: HeroSlideFraming;
  kenBurns?: boolean;
  mobileObjectPosition?: string;
  mobileLongFade?: boolean;
  /** Quando true, o painel mobile usa height:100% (altura vem do wrapper). */
  mobileHeightFromParent?: boolean;
}

/** Desktop inalterado (sm+). Mobile: <picture> + cover dimensionado pelo carBbox mobile. */
export function HeroFullBleedSlide({
  desktopSrc,
  mobileSrc,
  alt,
  sizes,
  priority,
  framing,
  kenBurns,
  mobileObjectPosition,
  mobileLongFade,
  mobileHeightFromParent,
}: HeroFullBleedSlideProps) {
  const desktopKen =
    kenBurns && framing.desktop.kenBurnsScale > 1
      ? "hero-ken-burns-contain-max motion-reduce:transform-none"
      : undefined;
  const desktopPanelStart = `${framing.desktop.panelStart * 100}%`;
  const mobilePos = mobileObjectPosition ?? framing.mobile.objectPosition;
  return (
    <div
      className="relative h-full w-full bg-[#0a1628] sm:absolute sm:inset-0"
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
            src={desktopSrc}
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
        className={cn(
          "hero-photo-pane-mobile absolute inset-x-0 top-0 w-full sm:hidden",
          mobileLongFade && "hero-photo-pane-mobile--long-fade",
          mobileHeightFromParent ? "h-full" : "h-[var(--hero-mobile-media-h,55svh)]",
        )}
        data-hero-layout="mobile"
        data-hero-soft-edge="true"
        data-hero-framing={heroFramingDatasetMobile(framing)}
      >
        <MotionPad kenBurns={undefined}>
          <picture className="absolute inset-0 block size-full">
            <source media="(max-width: 767px)" srcSet={mobileSrc} />
            <Image
              key={mobileSrc}
              src={mobileSrc}
              alt={alt}
              fill
              sizes="100vw"
              priority={priority}
              data-testid="hero-slide-image"
              className="object-cover"
              style={{ objectPosition: mobilePos }}
            />
          </picture>
        </MotionPad>
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-[#0a1628]",
            mobileLongFade ? "h-32" : "h-20",
          )}
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