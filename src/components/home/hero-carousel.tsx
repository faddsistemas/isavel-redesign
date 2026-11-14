"use client";

import {
  HeroVehicleBackdrop,
  HeroVehicleForeground,
} from "@/components/home/hero-vehicle-slide";
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
  const enableKenBurns = !reduceMotion;

  return (
    <section
      className="relative -mt-[var(--header-offset,7.5rem)] flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-[#0a1628]"
      data-testid="hero-carousel"
      data-active-index={selected}
      aria-roledescription="carrossel"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <AnimatePresence mode="sync" initial={false}>
          {vehicles.map((v, i) =>
            i === selected ? (
              <motion.div
                key={`bg-${v.id}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : CROSSFADE_S,
                  ease: EASE_OUT_PREMIUM,
                }}
              >
                <HeroVehicleBackdrop
                  src={localCoverPath(v)}
                  sizes="100vw"
                  priority={v.id === vehicles[0]?.id}
                />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl min-h-0 flex-col px-4 pt-[5.5rem] pb-24 sm:px-8 lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-rows-1 lg:items-stretch lg:gap-10 lg:px-8 lg:pt-24 lg:pb-20">
        <div className="relative order-1 flex min-h-[48vh] flex-1 lg:order-2 lg:min-h-0 lg:h-full">
          <AnimatePresence mode="sync" initial={false}>
            {vehicles.map((v, i) =>
              i === selected ? (
                <motion.div
                  key={`fg-${v.id}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : CROSSFADE_S,
                    ease: EASE_OUT_PREMIUM,
                  }}
                >
                  <HeroVehicleForeground
                    src={localCoverPath(v)}
                    alt={`${v.marca} ${v.modelo}`}
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    priority={v.id === vehicles[0]?.id}
                    kenBurns={enableKenBurns}
                  />
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-20 order-2 flex shrink-0 flex-col justify-end gap-4 bg-gradient-to-t from-black/80 via-black/45 to-transparent pb-2 pt-6 lg:order-1 lg:justify-center lg:self-center lg:bg-none lg:pb-12 lg:pt-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Destaque do estoque
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {titulo}
          </h1>
          <p className="text-2xl font-semibold text-white/95 sm:text-3xl">
            {formatPreco(current.preco)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
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

      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-30 flex items-center justify-between px-1 sm:px-3">
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
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-white/80 transition-colors duration-200 hover:text-white"
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
        className="absolute right-4 bottom-6 z-30 size-11 min-h-11 min-w-11 rounded-full border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white sm:right-8"
        aria-label={paused ? "Retomar carrossel" : "Pausar carrossel"}
        data-testid="hero-carousel-pause"
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
      </Button>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 translate-y-10 justify-center gap-1 sm:translate-y-12">
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