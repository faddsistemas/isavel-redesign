"use client";

import Image from "next/image";
import { VehiclePhoto } from "@/components/vehicles/vehicle-photo";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface VehicleGalleryProps {
  photos: string[];
  title: string;
}

export function VehicleGallery({ photos, title }: VehicleGalleryProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const [active, setActive] = useState(0);

  const onThumbClick = useCallback((index: number) => {
    setActive(index);
  }, []);

  return (
    <div className="flex flex-col gap-3" data-testid="vehicle-gallery">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl" ref={emblaRef}>
        <VehiclePhoto
          src={photos[active] ?? photos[0]}
          alt={`${title} — foto ${active + 1}`}
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
          padding="sm"
        />
      </div>
      {photos.length > 1 && (
        <div className="flex max-w-full flex-wrap gap-2">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onThumbClick(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2",
                i === active ? "border-primary" : "border-transparent",
              )}
              aria-label={`Miniatura ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-contain object-center bg-muted" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
