"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Veiculo } from "@/lib/types";
import { formatPreco } from "@/lib/format";
import { localCoverPath } from "@/lib/vehicles";
import { useVehiclePreview } from "@/context/vehicle-preview-context";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  vehicles: Veiculo[];
}

export function HeroCarousel({ vehicles }: HeroCarouselProps) {
  const { openPreview } = useVehiclePreview();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full" data-testid="hero-carousel">
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {vehicles.map((v) => {
            const titulo = `${v.marca} ${v.modelo}`;
            return (
              <div
                key={v.id}
                className="relative min-w-0 shrink-0 grow-0 basis-full"
              >
                <button
                  type="button"
                  className="relative block aspect-[16/9] w-full overflow-hidden bg-primary sm:aspect-[21/9]"
                  onClick={() => openPreview(v)}
                >
                  <Image
                    src={localCoverPath(v)}
                    alt={titulo}
                    fill
                    className="object-cover"
                    priority={v.id === vehicles[0]?.id}
                    sizes="100vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#002969]/90 via-[#002969]/30 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left text-white sm:p-8">
                    <span className="text-xs font-medium uppercase tracking-wide text-white/90">
                      Destaque do estoque
                    </span>
                    <span className="text-xl font-bold sm:text-3xl">{titulo}</span>
                    <span className="text-lg font-semibold sm:text-2xl">
                      {formatPreco(v.preco)}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Button
        variant="secondary"
        size="icon-lg"
        className="absolute top-1/2 left-2 z-10 size-11 -translate-y-1/2 rounded-full shadow-md"
        aria-label="Anterior"
        onClick={() => emblaApi?.scrollPrev()}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon-lg"
        className="absolute top-1/2 right-2 z-10 size-11 -translate-y-1/2 rounded-full shadow-md"
        aria-label="Próximo"
        onClick={() => emblaApi?.scrollNext()}
      >
        <ChevronRight className="size-5" />
      </Button>
      <div className="mt-3 flex justify-center gap-2">
        {vehicles.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "size-3 rounded-full transition",
              i === selected ? "bg-primary" : "bg-muted-foreground/40",
            )}
          />
        ))}
      </div>
    </div>
  );
}
