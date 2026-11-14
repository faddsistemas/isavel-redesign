import Image from "next/image";
import { cn } from "@/lib/utils";

export type VehiclePhotoPadding = "none" | "sm" | "md" | "hero";

const PADDING: Record<VehiclePhotoPadding, string> = {
  none: "inset-0",
  sm: "inset-2 sm:inset-3",
  md: "inset-3 sm:inset-4",
  hero: "inset-4 pt-24 pb-20 sm:inset-6 sm:pt-28 sm:pb-24",
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
}: VehiclePhotoProps) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden bg-[#e8ecf0]",
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover scale-125 object-center blur-2xl brightness-95 saturate-125"
        aria-hidden
      />
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