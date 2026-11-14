"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Veiculo } from "@/lib/types";
import { formatPreco } from "@/lib/format";
import { localCoverPath } from "@/lib/vehicles";
import { useVehiclePreview } from "@/context/vehicle-preview-context";
import { cn } from "@/lib/utils";
import { EASE_OUT_PREMIUM } from "@/components/motion/motion-tokens";

const AUTOPLAY_MS = 6000;
const CROSSFADE_S = 1.2;

interface HeroCarouselProps {
  vehicles: Veiculo[];
}

export function HeroCarousel({ vehicles }: HeroCarouselProps) {
  const { openPreview } = useVehiclePreview();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = vehicles.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setSelected(((index % count) + count) % count);
    },
    [count],
  );

  const goPrev = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(selected - 1);
    },
    [goTo, selected],
  );

  const goNext = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(selected + 1);
    },
    [goTo, selected],
  );

  const goToDot = useCallback(
    (e: MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      goTo(index);
    },
    [goTo],
  );

  useEffect(() => {
    if (paused || reduceMotion || count <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setSelected((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reduceMotion, count]);

  const openSlide = useCallback(
    (v: Veiculo) => {
      openPreview(v);
    },
    [openPreview],
  );

  const current = vehicles[selected];
  if (!current) return null;

  const titulo = `${current.marca} ${current.modelo}`;

  return (
    <section
      className="relative -mt-[var(--header-offset,7.5rem)] min-h-[min(100svh,920px)] w-full"
      data-testid="hero-carousel"
      data-active-index={selected}
      aria-roledescription="carrossel"
    >
      <div className="absolute inset-0 overflow-hidden bg-[#0a1628]">
        <AnimatePresence mode="sync" initial={false}>
          {vehicles.map((v, i) =>
            i === selected ? (
              <motion.div
                key={v.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : CROSSFADE_S,
                  ease: EASE_OUT_PREMIUM,
                }}
              >
                <div
                  className={cn(
                    "absolute inset-[-4%] size-[108%] origin-center",
                    !reduceMotion && "hero-ken-burns",
                  )}
                >
                  <Image
                    src={localCoverPath(v)}
                    alt={`${v.marca} ${v.modelo}`}
                    fill
                    className="object-cover"
                    priority={v.id === vehicles[0]?.id}
                    sizes="100vw"
                  />
                </div>
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex min-h-[min(100svh,920px)] flex-col justify-end px-4 pb-16 pt-32 sm:px-8 sm:pb-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Destaque do estoque
          </p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
            {titulo}
          </h1>
          <p className="text-2xl font-semibold text-white/95 sm:text-3xl">
            {formatPreco(current.preco)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              data-testid="hero-slide-open"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 bg-white/15 px-6 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-colors duration-200 hover:bg-white/25"
              aria-label={`Abrir prévia: ${titulo}`}
              onClick={() => openSlide(current)}
            >
              Ver detalhes
            </button>
            <a
              href="#busca-veiculo"
              className="link-underline text-sm font-medium text-white/90"
            >
              Buscar outro modelo
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-20 flex items-center justify-between px-1 sm:px-3">
        <Button
          type="button"
          variant="secondary"
          size="icon-lg"
          className="pointer-events-auto size-11 min-h-11 min-w-11 rounded-full border-white/20 bg-white/90 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
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
          className="pointer-events-auto size-11 min-h-11 min-w-11 rounded-full border-white/20 bg-white/90 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
          aria-label="Próximo"
          data-testid="hero-carousel-next"
          onClick={goNext}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <motion.button
        type="button"
        className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80 transition-colors duration-200 hover:text-white"
        aria-label="Rolar para o conteúdo"
        onClick={() => {
          document.getElementById("busca-veiculo")?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
          });
        }}
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <ArrowDown className="size-5" aria-hidden />
      </motion.button>

      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        className="absolute right-4 bottom-6 z-20 size-11 min-h-11 min-w-11 rounded-full border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white sm:right-8"
        aria-label={paused ? "Retomar carrossel" : "Pausar carrossel"}
        data-testid="hero-carousel-pause"
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
      </Button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 translate-y-10 justify-center gap-1 sm:translate-y-12">
        {vehicles.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            data-testid={`hero-carousel-dot-${i}`}
            onClick={(e) => goToDot(e, i)}
            className="flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full"
          >
            <span
              className={cn(
                "size-2.5 rounded-full transition-colors duration-200",
                i === selected ? "bg-white" : "bg-white/40",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}