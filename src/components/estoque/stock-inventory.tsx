"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { filterVehicles } from "@/lib/vehicles";
import type { StockFilters } from "@/lib/types";

export function StockInventory() {
  const searchParams = useSearchParams();

  const filters: StockFilters = useMemo(
    () => ({
      termo: searchParams.get("termo") ?? undefined,
      marca: searchParams.get("marca") ?? undefined,
      modelo: searchParams.get("modelo") ?? undefined,
      anoMin: searchParams.get("ano_min") ?? undefined,
      anoMax: searchParams.get("ano_max") ?? undefined,
      precoMin: searchParams.get("preco_min") ?? undefined,
      precoMax: searchParams.get("preco_max") ?? undefined,
      cambio: searchParams.get("cambio") ?? undefined,
      combustivel: searchParams.get("combustivel") ?? undefined,
      loja: searchParams.get("loja") ?? undefined,
      tipo: searchParams.get("tipo") ?? undefined,
      ordenacao: searchParams.get("ordenacao") ?? undefined,
    }),
    [searchParams],
  );

  const vehicles = filterVehicles(filters);

  return (
    <div>
      <p className="mb-4 text-sm text-muted-foreground" data-testid="stock-count">
        <strong className="text-foreground">{vehicles.length}</strong> veículo
        {vehicles.length === 1 ? "" : "s"} encontrado
        {vehicles.length === 1 ? "" : "s"}
      </p>
      {vehicles.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          Nenhum veículo encontrado com esses filtros. Tente outra busca.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <li key={v.id}>
              <VehicleCard vehicle={v} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
