"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, watchDrag: true },
    [Autoplay({ delay: 5000, stopOnInteraction: true })],
  );
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

  const openSlide = useCallback(
    (v: Veiculo) => {
      openPreview(v);
    },
    [openPreview],
  );

  const goPrev = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi],
  );

  const goNext = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi],
  );

  const goTo = useCallback(
    (e: MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <div
      className="relative w-full"
      data-testid="hero-carousel"
      data-active-index={selected}
    >
      <div className="overflow-hidden rounded-xl" ref={emblaRef}>
        <div className="flex">
          {vehicles.map((v) => {
            const titulo = `${v.marca} ${v.modelo}`;
            return (
              <div
                key={v.id}
                className="relative min-w-0 shrink-0 grow-0 basis-full"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-primary sm:aspect-[21/9]">
                  <button
                    type="button"
                    data-testid="hero-slide-open"
                    className="absolute inset-0 z-0 block size-full cursor-pointer"
                    aria-label={`Abrir prévia: ${titulo}`}
                    onClick={() => openSlide(v)}
                  >
                    <Image
                      src={localCoverPath(v)}
                      alt={titulo}
                      fill
                      className="object-cover"
                      priority={v.id === vehicles[0]?.id}
                      sizes="100vw"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#002969]/90 via-[#002969]/30 to-transparent"
                      aria-hidden
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4 text-left text-white sm:p-8">
                      <span className="text-xs font-medium uppercase tracking-wide text-white/90">
                        Destaque do estoque
                      </span>
                      <span className="text-xl font-bold sm:text-3xl">{titulo}</span>
                      <span className="text-lg font-semibold sm:text-2xl">
                        {formatPreco(v.preco)}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-20 flex items-center justify-between px-1 sm:px-2">
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          className="pointer-events-auto size-11 min-h-11 min-w-11 rounded-full shadow-md"
          aria-label="Anterior"
          data-testid="hero-carousel-prev"
          onClick={goPrev}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          className="pointer-events-auto size-11 min-h-11 min-w-11 rounded-full shadow-md"
          aria-label="Próximo"
          data-testid="hero-carousel-next"
          onClick={goNext}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <div className="mt-3 flex justify-center gap-1">
        {vehicles.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            data-testid={`hero-carousel-dot-${i}`}
            onClick={(e) => goTo(e, i)}
            className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full"
          >
            <span
              className={cn(
                "size-3 rounded-full transition",
                i === selected ? "bg-primary" : "bg-muted-foreground/40",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
