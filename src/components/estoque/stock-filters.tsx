"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ORDENACAO_OPTIONS } from "@/lib/constants";
import { getFilterOptions, getMarcasComEstoque } from "@/lib/vehicles";

function useFilterParams() {
  const searchParams = useSearchParams();
  return useMemo(
    () => ({
      termo: searchParams.get("termo") ?? "",
      marca: searchParams.get("marca") ?? "",
      modelo: searchParams.get("modelo") ?? "",
      anoMin: searchParams.get("ano_min") ?? "",
      anoMax: searchParams.get("ano_max") ?? "",
      precoMin: searchParams.get("preco_min") ?? "",
      precoMax: searchParams.get("preco_max") ?? "",
      cambio: searchParams.get("cambio") ?? "",
      combustivel: searchParams.get("combustivel") ?? "",
      loja: searchParams.get("loja") ?? "",
      tipo: searchParams.get("tipo") ?? "",
      ordenacao: searchParams.get("ordenacao") ?? "relevancia",
    }),
    [searchParams],
  );
}

export function StockFiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = useFilterParams();
  const opts = getFilterOptions();
  const marcas = getMarcasComEstoque();

  const pushParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, val] of Object.entries(updates)) {
        if (!val) next.delete(key);
        else next.set(key, val);
      }
      const qs = next.toString();
      router.push(qs ? `/estoque/?${qs}` : "/estoque/");
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm">
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          pushParams({ termo: String(fd.get("termo") ?? "") });
        }}
      >
        <Input
          name="termo"
          defaultValue={current.termo}
          placeholder="Pesquisar marca ou modelo..."
          className="min-h-11 flex-1"
          data-testid="stock-search"
        />
        <Button type="submit" className="min-h-11">
          Buscar
        </Button>
      </form>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={current.ordenacao}
          onValueChange={(v) => pushParams({ ordenacao: v ?? "relevancia" })}
        >
          <SelectTrigger className="min-h-11 w-full sm:w-[200px]" data-testid="stock-sort">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ORDENACAO_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FilterSheet pushParams={pushParams} current={current} opts={opts} marcas={marcas} />
      </div>
    </div>
  );
}

function FilterSheet({
  pushParams,
  current,
  opts,
  marcas,
}: {
  pushParams: (u: Record<string, string>) => void;
  current: ReturnType<typeof useFilterParams>;
  opts: ReturnType<typeof getFilterOptions>;
  marcas: ReturnType<typeof getMarcasComEstoque>;
}) {
  const router = useRouter();
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" className="min-h-11 gap-2" data-testid="open-filters">
          <SlidersHorizontal className="size-4" />
          Filtrar
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,360px)] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <form
          className="flex flex-col gap-4 px-2 pb-8"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            pushParams({
              marca: String(fd.get("marca") ?? ""),
              modelo: String(fd.get("modelo") ?? ""),
              ano_min: String(fd.get("ano_min") ?? ""),
              ano_max: String(fd.get("ano_max") ?? ""),
              preco_min: String(fd.get("preco_min") ?? ""),
              preco_max: String(fd.get("preco_max") ?? ""),
              cambio: String(fd.get("cambio") ?? ""),
              combustivel: String(fd.get("combustivel") ?? ""),
              loja: String(fd.get("loja") ?? ""),
              tipo: String(fd.get("tipo") ?? ""),
            });
          }}
        >
          <FieldSelect name="marca" label="Marca" defaultValue={current.marca}>
            <option value="">Todas</option>
            {marcas.map((m) => (
              <option key={m.marca_slug} value={m.marca_slug}>
                {m.marca} ({m.count})
              </option>
            ))}
          </FieldSelect>
          <FieldSelect name="modelo" label="Modelo" defaultValue={current.modelo}>
            <option value="">Todos</option>
            {opts.modelos.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect name="tipo" label="Tipo" defaultValue={current.tipo}>
            <option value="">Todos</option>
            {opts.tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect name="loja" label="Loja" defaultValue={current.loja}>
            <option value="">Todas</option>
            {opts.lojas.map((l) => (
              <option key={l} value={l}>
                {l.replace("Isavel Veiculos - ", "")}
              </option>
            ))}
          </FieldSelect>
          <div className="grid grid-cols-2 gap-2">
            <FieldInput name="ano_min" label="Ano mín." defaultValue={current.anoMin} placeholder={String(opts.anoMin)} />
            <FieldInput name="ano_max" label="Ano máx." defaultValue={current.anoMax} placeholder={String(opts.anoMax)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldInput name="preco_min" label="Preço mín." defaultValue={current.precoMin} />
            <FieldInput name="preco_max" label="Preço máx." defaultValue={current.precoMax} />
          </div>
          <FieldSelect name="cambio" label="Câmbio" defaultValue={current.cambio}>
            <option value="">Todos</option>
            {opts.cambios.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </FieldSelect>
          <FieldSelect name="combustivel" label="Combustível" defaultValue={current.combustivel}>
            <option value="">Todos</option>
            {opts.combustiveis.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </FieldSelect>
          <Button type="submit" className="min-h-11 w-full">
            Aplicar filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={() => router.push("/estoque/")}
          >
            Limpar filtros
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function FieldSelect({
  name,
  label,
  defaultValue,
  children,
}: {
  name: string;
  label: string;
  defaultValue: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
      >
        {children}
      </select>
    </div>
  );
}

function FieldInput({
  name,
  label,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} placeholder={placeholder} className="min-h-11" />
    </div>
  );
}
