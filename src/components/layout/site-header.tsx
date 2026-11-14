"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HORARIO, PHONE_ABAETE, PHONE_ABAETE_RAW } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/estoque/", label: "Estoque" },
  { href: "/venda-seu-carro/", label: "Venda seu carro" },
  { href: "/financie/", label: "Financie" },
  { href: "/sobre/", label: "Sobre" },
] as const;

function NavLinks({
  className,
  onNavigate,
  onHero,
}: {
  className?: string;
  onNavigate?: () => void;
  onHero?: boolean;
}) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8",
        className,
      )}
    >
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "link-underline text-sm font-semibold uppercase tracking-wide transition-colors duration-200",
            onHero
              ? "nav-on-hero text-white hover:text-white/90"
              : "text-foreground hover:text-primary",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const [pastHero, setPastHero] = useState(false);
  const overHero = isHome && !pastHero;

  const syncHeroScroll = useCallback(() => {
    const hero = document.querySelector('[data-testid="hero-carousel"]');
    if (!hero) {
      setPastHero(false);
      return;
    }
    const rect = hero.getBoundingClientRect();
    setPastHero(rect.bottom <= 80);
  }, []);

  useEffect(() => {
    if (!isHome) {
      setPastHero(true);
      return;
    }
    setPastHero(false);
    syncHeroScroll();
    window.addEventListener("scroll", syncHeroScroll, { passive: true });
    window.addEventListener("resize", syncHeroScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", syncHeroScroll);
      window.removeEventListener("resize", syncHeroScroll);
    };
  }, [isHome, syncHeroScroll]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "relative z-50 px-4 py-2 text-center text-xs transition-colors duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-sm",
          overHero
            ? "bg-black/40 text-white/95 backdrop-blur-sm"
            : "bg-primary text-primary-foreground",
        )}
      >
        {HORARIO}
      </div>
      <header
        data-header-over-hero={overHero ? "true" : "false"}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-[background-color,border-color,box-shadow] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          overHero
            ? "border-transparent bg-transparent shadow-none"
            : "border-border bg-white/95 shadow-sm backdrop-blur-md",
        )}
        style={{ ["--header-offset" as string]: "7.5rem" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="shrink-0 rounded-lg bg-white/95 px-2.5 py-1.5 shadow-md ring-1 ring-white/50"
          >
            <Image
              src={withBasePath("/assets/logo.png")}
              alt="Isavel Veículos"
              width={180}
              height={46}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            <NavLinks onHero={overHero} />
            <a
              href={`tel:${PHONE_ABAETE_RAW}`}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
                overHero
                  ? "nav-on-hero text-white hover:text-white/90"
                  : "text-primary",
              )}
            >
              <Phone className="size-4" aria-hidden />
              {PHONE_ABAETE}
            </a>
          </div>

          <Button
            variant={overHero ? "secondary" : "outline"}
            size="icon-lg"
            className={cn(
              "lg:hidden",
              overHero &&
                "border-white/35 bg-white/15 text-white backdrop-blur-md hover:bg-white/25",
            )}
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-opacity duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 flex h-full w-[min(100%,400px)] flex-col bg-white shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-4">
            <span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Menu
            </span>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-8 px-6 py-8">
            <NavLinks onNavigate={() => setOpen(false)} />
            <a
              href={`tel:${PHONE_ABAETE_RAW}`}
              className="flex min-h-11 items-center gap-2 font-medium text-primary transition-colors duration-200"
              onClick={() => setOpen(false)}
            >
              <Phone className="size-4" aria-hidden />
              Ligar {PHONE_ABAETE}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}