"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useRouter();
  const [termo, setTermo] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = termo.trim();
    if (q) router.push(`/estoque/?termo=${encodeURIComponent(q)}`);
    else router.push("/estoque/");
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6">
      <h1 className="text-xl font-bold text-primary sm:text-2xl">
        Qual veículo você está buscando?
      </h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Marca ou modelo"
          className="min-h-11 flex-1"
          data-testid="hero-search-input"
          aria-label="Buscar marca ou modelo"
        />
        <Button type="submit" size="lg" className="min-h-11 gap-2">
          <Search className="size-4" />
          Buscar
        </Button>
      </form>
      <Link
        href="/estoque/"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-h-11 w-full sm:w-auto")}
      >
        Ver todo o estoque
      </Link>
    </div>
  );
}
