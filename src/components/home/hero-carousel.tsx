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

  useLayoutEffect(() => {
    const update = () => {
      if (window.innerWidth >= 768 || !framing) {
        setMobileLayout(null);
        document.documentElement.style.removeProperty("--hero-mobile-media-h");
        return;
      }
      const svhPx = measureSvhPx();
      const vw = window.innerWidth;
      const chromeEstimate = 300;
      let layout = computeMobileHeroMediaLayout(vw, svhPx, framing.imageAspect, framing.carBbox, {
        maxMediaPx: svhPx - chromeEstimate,
      });

      const section = sectionRef.current;
      if (section) {
        const copy = section.querySelector('[data-testid="hero-slide-copy"]');
        const footer = section.querySelector('[data-testid="hero-mobile-footer"]');
        const copyH = copy?.getBoundingClientRect().height ?? 0;
        const footerH = footer?.getBoundingClientRect().height ?? 0;
        const chrome = copyH + footerH + 16;
        layout = computeMobileHeroMediaLayout(vw, svhPx, framing.imageAspect, framing.carBbox, {
          maxMediaPx: svhPx - chrome,
        });
      }

      const apply = (next: typeof layout) => {
        setMobileLayout(next);
        document.documentElement.style.setProperty(
          "--hero-mobile-media-h",
          `${next.mediaHeightPx}px`,
        );
      };
      apply(layout);

      requestAnimationFrame(() => {
        if (window.innerWidth >= 768 || !framing) return;
        const el = sectionRef.current;
        if (!el) return;
        const copy = el.querySelector('[data-testid="hero-slide-copy"]');
        const footer = el.querySelector('[data-testid="hero-mobile-footer"]');
        const copyH = copy?.getBoundingClientRect().height ?? 190;
        const footerH = footer?.getBoundingClientRect().height ?? 96;
        const chrome = copyH + footerH + 12;
        const refined = computeMobileHeroMediaLayout(
          vw,
          svhPx,
          framing.imageAspect,
          framing.carBbox,
          { maxMediaPx: svhPx - chrome },
        );
        if (refined.mediaHeightPx !== layout.mediaHeightPx) {
          apply(refined);
        }
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selected, framing]);

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
        className="relative z-10 shrink-0 px-4 pt-3 pb-2 sm:mt-auto sm:flex sm:w-full sm:flex-col sm:justify-end sm:px-8 sm:pb-20 sm:pt-24"
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
        className="relative z-20 mt-auto flex flex-col items-center gap-0.5 pb-5 pt-1 sm:absolute sm:bottom-6 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2 sm:translate-y-12 sm:pb-0 sm:pt-0"
      >
        <motion.button
          type="button"
          className="flex flex-col items-center gap-1 text-white/80 transition-colors duration-200 hover:text-white sm:hidden"
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

        <div className="flex justify-center gap-1">
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
      </div>

      <Button
        type="button"
        variant="secondary"
        size="icon-lg"
        className="absolute bottom-5 left-4 z-20 size-11 min-h-11 min-w-11 rounded-full border-white/20 bg-white/15 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 hover:text-white sm:right-8 sm:bottom-6 sm:left-auto"
        aria-label={paused ? "Retomar carrossel" : "Pausar carrossel"}
        data-testid="hero-carousel-pause"
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? <Play className="size-5" /> : <Pause className="size-5" />}
      </Button>
    </section>
  );
}