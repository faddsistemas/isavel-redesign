"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVehiclePreview } from "@/context/vehicle-preview-context";
import { formatAno, formatKm, formatPreco } from "@/lib/format";
import type { Veiculo } from "@/lib/types";
import { localCoverPath } from "@/lib/vehicles";

interface VehicleCardProps {
  vehicle: Veiculo;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const { openPreview } = useVehiclePreview();
  const titulo = `${vehicle.marca} ${vehicle.modelo}`;
  const loja = vehicle.loja.replace("Isavel Veiculos - ", "");

  return (
    <Card
      className="group cursor-pointer overflow-hidden border-border/80 shadow-sm transition hover:shadow-md"
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
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {vehicle.tipo === "Motos" && (
            <Badge className="absolute top-2 left-2">Moto / UTV</Badge>
          )}
        </div>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-foreground">{titulo}</h3>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {vehicle.versao}
              </p>
            </div>
          </div>
          <p className="text-xl font-bold text-primary">
            {formatPreco(vehicle.preco)}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatAno(vehicle.ano_fabricacao, vehicle.ano_modelo)} ·{" "}
            {formatKm(vehicle.km)}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {loja}
          </p>
        </CardContent>
      </button>
    </Card>
  );
}
