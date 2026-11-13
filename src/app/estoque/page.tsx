import { Suspense } from "react";
import type { Metadata } from "next";
import { StockFiltersBar } from "@/components/estoque/stock-filters";
import { StockInventory } from "@/components/estoque/stock-inventory";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Estoque",
  description:
    "Confira carros e seminovos disponíveis na Isavel Veículos — Abaeté e Nova Serrana. Filtre por marca, preço, ano e loja.",
};

export default function EstoquePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Estoque</h1>
      <FadeIn className="mb-8">
        <Suspense fallback={<div className="h-32 animate-pulse rounded-xl bg-muted" />}>
          <StockFiltersBar />
        </Suspense>
      </FadeIn>
      <Suspense fallback={<p className="text-muted-foreground">Carregando veículos…</p>}>
        <StockInventory />
      </Suspense>
    </div>
  );
}
