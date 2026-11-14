"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVehiclePreview } from "@/context/vehicle-preview-context";
import { formatAno, formatKm, formatPreco } from "@/lib/format";
import type { Veiculo } from "@/lib/types";
import { localCoverPath } from "@/lib/vehicles";
import { cn } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Veiculo;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { openPreview } = useVehiclePreview();
  const titulo = `${vehicle.marca} ${vehicle.modelo}`;
  const loja = vehicle.loja.replace("Isavel Veiculos - ", "");

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-[box-shadow,border-color] duration-[250ms] hover:border-primary/30 hover:shadow-lg"
      data-testid="vehicle-card"
    >
      <button
        type="button"
        onClick={() => openPreview(vehicle)}
        className="flex w-full flex-col text-left"
        aria-label={`Abrir prévia de ${titulo}`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={localCoverPath(vehicle)}
            alt={titulo}
            fill
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent"
            aria-hidden
          />
          {vehicle.tipo === "Motos" && (
            <Badge className="absolute top-3 left-3">Moto / UTV</Badge>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
            <span className="line-clamp-1 text-sm font-semibold text-white">
              {titulo}
            </span>
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md",
                "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5",
              )}
              aria-hidden
            >
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {vehicle.versao}
          </p>
          <p className="text-xl font-bold text-primary">{formatPreco(vehicle.preco)}</p>
          <p className="text-sm text-muted-foreground">
            {formatAno(vehicle.ano_fabricacao, vehicle.ano_modelo)} ·{" "}
            {formatKm(vehicle.km)}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {loja}
          </p>
        </div>
      </button>
    </article>
  );
}