import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroVehicleSlideProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  kenBurns?: boolean;
  className?: string;
}

/** Fundo full-bleed desfocado (object-cover apenas no blur). */
export function HeroVehicleBackdrop({
  src,
  sizes,
  priority,
}: Pick<HeroVehicleSlideProps, "src" | "sizes" | "priority">) {
  return (
    <div className="relative size-full">
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-center blur-3xl brightness-[0.38] saturate-110 scale-[1.4]"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/50"
        aria-hidden
      />
    </div>
  );
}

/** Carro inteiro visível (object-contain), sem moldura. */
export function HeroVehicleForeground({
  src,
  alt,
  sizes,
  priority,
  kenBurns,
  className,
}: HeroVehicleSlideProps) {
  return (
    <div
      className={cn(
        "relative flex size-full min-h-0 items-center justify-center p-2 sm:p-4",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full w-full",
          kenBurns && "hero-ken-burns-subtle motion-reduce:transform-none",
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