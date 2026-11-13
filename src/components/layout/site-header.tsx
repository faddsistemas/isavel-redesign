"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    <nav className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6", className)}>
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="text-sm font-semibold uppercase tracking-wide text-foreground hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-border bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="shrink-0">
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
              className="flex items-center gap-2 text-sm font-medium text-primary"
            >
              <Phone className="size-4" aria-hidden />
              {PHONE_ABAETE}
            </a>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="lg:hidden">
              <Button variant="outline" size="icon-lg" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100%,320px)]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 px-4 pb-8">
                <NavLinks onNavigate={() => setOpen(false)} />
                <a
                  href={`tel:${PHONE_ABAETE_RAW}`}
                  className="flex min-h-11 items-center gap-2 font-medium text-primary"
                >
                  <Phone className="size-4" aria-hidden />
                  Ligar {PHONE_ABAETE}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}

function TopBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground sm:text-sm">
      {HORARIO}
    </div>
  );
}
