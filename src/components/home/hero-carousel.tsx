"use client";

import { HeroFullBleedSlide } from "@/components/home/hero-vehicle-slide";
import {
  getHeroSlideFraming,
  heroSlideImagePath,
} from "@/lib/hero-slide-framing";
import { computeMobileHeroMediaLayout } from "@/lib/hero-mobile-layout";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
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
import { useVehiclePreview } from "@/context/vehicle-preview-context";
import { cn } from "@/lib/utils";
import { EASE_OUT_PREMIUM } from "@/components/motion/motion-tokens";

const AUTOPLAY_MS = 6000;
const CROSSFADE_S = 1.2;

interface HeroCarouselProps {
  vehicles: Veiculo[];
}

function measureSvhPx(): number {
  const probe = document.createElement("div");
  probe.style.height = "100svh";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  return px || window.innerHeight;
}

function readMobileHeroImageNatural(
  section: HTMLElement,
): { width: number; height: number } | null {
  const img = section.querySelector(
    '[data-hero-layout="mobile"] [data-testid="hero-slide-image"]',
  ) as HTMLImageElement | null;
  if (!img || img.naturalWidth < 1 || img.naturalHeight < 1) return null;
  return { width: img.naturalWidth, height: img.naturalHeight };
}

export function HeroCarousel({ vehicles }: HeroCarouselProps) {
  const { openPreview } = useVehiclePreview();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [mobileLayout, setMobileLayout] = useState<{
    mediaHeightPx: number;
    objectPosition: string;
  } | null>(null);

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

  const current = vehicles[selected];
  const framing = current ? getHeroSlideFraming(current) : null;

  const applyMobileLayout = useCallback(
    (fr: NonNullable<typeof framing>, naturalW: number, naturalH: number) => {
      const svhPx = measureSvhPx();
      const vw = window.innerWidth;
      const layout = computeMobileHeroMediaLayout(
        vw,
        svhPx,
        naturalW,
        naturalH,
        fr.carBbox,
      );
      setMobileLayout({
        mediaHeightPx: layout.mediaHeightPx,
        objectPosition: layout.objectPosition,
      });
      document.documentElement.style.setProperty(
        "--hero-mobile-media-h",
        `${layout.mediaHeightPx}px`,
      );
    },
    [],
  );

  useLayoutEffect(() => {
    let loadCleanup: (() => void) | undefined;

    const update = () => {
      loadCleanup?.();
      loadCleanup = undefined;

      if (window.innerWidth >= 768 || !framing) {
        setMobileLayout(null);
        document.documentElement.style.removeProperty("--hero-mobile-media-h");
        return;
      }

      const section = sectionRef.current;
      const natural = section ? readMobileHeroImageNatural(section) : null;
      const naturalW = natural?.width ?? framing.imageNaturalWidth;
      const naturalH = natural?.height ?? framing.imageNaturalHeight;
      applyMobileLayout(framing, naturalW, naturalH);

      if (!natural && section) {
        const img = section.querySelector(
          '[data-hero-layout="mobile"] [data-testid="hero-slide-image"]',
        ) as HTMLImageElement | null;
        if (img && !img.complete) {
          const onLoad = () => {
            const n = readMobileHeroImageNatural(section);
            if (n && framing) applyMobileLayout(framing, n.width, n.height);
          };
          img.addEventListener("load", onLoad, { once: true });
          loadCleanup = () => img.removeEventListener("load", onLoad);
        }
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      loadCleanup?.();
    };
  }, [selected, framing, applyMobileLayout]);

  const openSlide = useCallback(
    (v: Veiculo) => {
      openPreview(v);
    },
    [openPreview],
  );

  if (!current || !framing) return null;

  const titulo = `${current.marca} ${current.modelo}`;
  const enableKenBurns = !reduceMotion;

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[var(--header-offset,7.5rem)] flex h-[100svh] min-h-[560px] w-full flex-col overflow-hidden bg-[#0a1628]"
      data-testid="hero-carousel"
      data-active-index={selected}
      data-mobile-media-height={mobileLayout?.mediaHeightPx}
      aria-roledescription="carrossel"
    >
      <div
        className="relative shrink-0 sm:absolute sm:inset-0 sm:shrink"
        style={
          mobileLayout
            ? { height: `${mobileLayout.mediaHeightPx}px` }
            : undefined
        }
      >
        <AnimatePresence mode="sync" initial={false}>
          {vehicles.map((v, i) =>
            i === selected ? (
              <motion.div
                key={v.id}
                className="absolute inset-0 sm:inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : CROSSFADE_S,
                  ease: EASE_OUT_PREMIUM,
                }}
              >
                <HeroFullBleedSlide
                  src={heroSlideImagePath(v, getHeroSlideFraming(v))}
                  alt={`${v.marca} ${v.modelo}`}
                  sizes="100vw"
                  priority={v.id === vehicles[0]?.id}
                  framing={getHeroSlideFraming(v)}
                  kenBurns={enableKenBurns}
                  mobileMediaHeightPx={mobileLayout?.mediaHeightPx}
                  mobileObjectPosition={mobileLayout?.objectPosition}
                />
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 hidden h-44 bg-gradient-to-b from-black/50 via-black/15 to-transparent sm:block sm:h-52"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[min(100%,38rem)] bg-gradient-to-r from-[#0a1628] via-[#0a1628]/80 to-transparent sm:block"
          aria-hidden
        />
      </div>

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col justify-center px-4 py-2 sm:mt-auto sm:flex-none sm:justify-end sm:px-8 sm:pb-20 sm:pt-24"
        data-testid="hero-slide-copy"
      >
        <div
          className="flex w-fit max-w-[min(100%,22rem)] flex-col items-start gap-3 text-left sm:gap-4"
          data-testid="hero-slide-copy-inner"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            Destaque do estoque
          </p>
          <h1 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-5xl">
            {titulo}
          </h1>
          <p className="text-2xl font-semibold text-white/95 sm:text-3xl">
            {formatPreco(current.preco)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3 sm:mt-2">
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

      <div className="pointer-events-none absolute inset-y-0 right-0 left-0 z-20 hidden items-center justify-between px-1 sm:flex sm:px-3">
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
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1 text-white/80 transition-colors duration-200 hover:text-white sm:flex"
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

      <div
        data-testid="hero-mobile-footer"
        className="relative z-20 mt-auto shrink-0 px-3 pb-5 sm:absolute sm:bottom-6 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2 sm:translate-y-12 sm:px-0 sm:pb-0"
      >
        <div className="grid w-full max-w-md grid-cols-[auto_1fr_auto] items-center gap-2 sm:flex sm:justify-center">
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            className="size-11 min-h-11 min-w-11 shrink-0 rounded-full border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white sm:hidden"
            aria-label={paused ? "Retomar carrossel" : "Pausar carrossel"}
            data-testid="hero-carousel-pause"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
          </Button>

          <motion.button
            type="button"
            className="col-span-3 flex flex-col items-center gap-1 text-white/80 transition-colors duration-200 hover:text-white sm:col-span-1 sm:hidden"
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

          <div className="col-start-2 flex justify-center gap-0.5">
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

          <span className="size-11 sm:hidden" aria-hidden />
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        className="absolute right-4 bottom-6 z-20 hidden size-11 min-h-11 min-w-11 rounded-full border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white sm:inline-flex sm:right-8"
        aria-label={paused ? "Retomar carrossel" : "Pausar carrossel"}
        data-testid="hero-carousel-pause-desktop"
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
      </Button>
    </section>
  );
}