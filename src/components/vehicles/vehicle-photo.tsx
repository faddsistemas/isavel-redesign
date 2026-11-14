import Image from "next/image";
import { cn } from "@/lib/utils";

export type VehiclePhotoPadding = "none" | "sm" | "md" | "hero";

const PADDING: Record<VehiclePhotoPadding, string> = {
  none: "inset-0",
  sm: "inset-2 sm:inset-3",
  md: "inset-3 sm:inset-4",
  hero:
    "inset-x-1 top-[max(4.75rem,11%)] bottom-[max(11rem,30%)] sm:inset-x-3 sm:top-[max(5rem,12%)] sm:bottom-[max(12rem,28%)]",
};

export interface VehiclePhotoProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  kenBurns?: boolean;
  hoverZoom?: boolean;
  padding?: VehiclePhotoPadding;
  /** Fundo desfocado extra escuro (hero full-bleed) */
  heroBackdrop?: boolean;
}

/**
 * Foto de veículo com enquadramento completo (object-contain) e fundo neutro / blur da mesma imagem.
 */
export function VehiclePhoto({
  src,
  alt,
  sizes,
  priority,
  className,
  kenBurns,
  hoverZoom,
  padding = "sm",
  heroBackdrop,
}: VehiclePhotoProps) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden",
        heroBackdrop ? "bg-[#0a1628]" : "bg-[#e8ecf0]",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover object-center blur-3xl saturate-110",
          heroBackdrop
            ? "scale-[1.35] brightness-[0.4]"
            : "scale-125 brightness-95",
        )}
        aria-hidden
      />
      {heroBackdrop ? (
        <span
          className="pointer-events-none absolute inset-0 bg-black/45"
          aria-hidden
        />
      ) : null}
      <div
        className={cn(
          "absolute",
          PADDING[padding],
          kenBurns && "hero-ken-burns-contain motion-reduce:transform-none",
          hoverZoom &&
            "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transform-none",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain object-center"
        />
      </div>
    </div>
  );
}