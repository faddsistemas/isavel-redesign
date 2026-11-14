"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HORARIO, PHONE_ABAETE, PHONE_ABAETE_RAW } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { withBasePath } from "@/lib/base-path";

const NAV = [
  { href: "/estoque/", label: "Estoque" },
  { href: "/venda-seu-carro/", label: "Venda seu carro" },
  { href: "/financie/", label: "Financie" },
  { href: "/sobre/", label: "Sobre" },
] as const;

function NavLinks({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
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
          className="link-underline text-sm font-semibold uppercase tracking-wide text-foreground transition-colors duration-200 hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="relative z-50 bg-primary px-4 py-2 text-center text-xs text-primary-foreground sm:text-sm">
        {HORARIO}
      </div>
      <header
        className="sticky top-0 z-50 w-full border-b border-border bg-white/95 shadow-sm backdrop-blur-md"
        style={{ ["--header-offset" as string]: "7.5rem" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="shrink-0 rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-border/60"
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
            <NavLinks />
            <a
              href={`tel:${PHONE_ABAETE_RAW}`}
              className="flex items-center gap-2 text-sm font-medium text-primary transition-colors duration-200"
            >
              <Phone className="size-4" aria-hidden />
              {PHONE_ABAETE}
            </a>
          </div>

          <Button
            variant="outline"
            size="icon-lg"
            className="lg:hidden"
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