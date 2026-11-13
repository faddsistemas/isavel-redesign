"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { formatAno, formatKm, formatPreco } from "@/lib/format";
import type { Veiculo } from "@/lib/types";
import { localPhotoPaths, vehiclePathFromUrl } from "@/lib/vehicles";
import { buildWhatsAppUrl, vehicleInterestMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface VehiclePreviewModalProps {
  vehicle: Veiculo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function PreviewActions({
  detailPath,
  wa,
  className,
}: {
  detailPath: string;
  wa: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full min-w-0 max-w-full shrink-0 flex-col gap-2 border-t border-border bg-popover p-4 sm:flex-row sm:items-stretch",
        className,
      )}
      data-testid="preview-actions"
    >
      <Link
        href={detailPath}
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          "min-h-11 w-full max-w-full min-w-0 shrink whitespace-normal text-center sm:flex-1 sm:basis-0",
        )}
        data-testid="preview-ver-anuncio"
      >
        Ver anúncio completo
      </Link>
      <Link
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "secondary", size: "lg" }),
          "min-h-11 w-full max-w-full min-w-0 shrink whitespace-normal text-center sm:flex-1 sm:basis-0 border border-[#128C4A] bg-[#e8f8ee] text-[#128C4A] hover:bg-[#d4f0df]",
        )}
        data-testid="preview-whatsapp"
      >
        <MessageCircle data-icon="inline-start" className="size-4 shrink-0" />
        Chamar no WhatsApp
      </Link>
    </div>
  );
}

export function VehiclePreviewModal({
  vehicle,
  open,
  onOpenChange,
}: VehiclePreviewModalProps) {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!vehicle) return null;

  const photos = localPhotoPaths(vehicle);
  const titulo = `${vehicle.marca} ${vehicle.modelo}`;
  const preco = formatPreco(vehicle.preco);
  const detailPath = vehiclePathFromUrl(vehicle);
  const wa = buildWhatsAppUrl(
    vehicleInterestMessage(`${titulo} — ${vehicle.versao}`, preco),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="box-border max-h-[90dvh] w-full max-w-[calc(100vw-1.5rem)] min-w-0 gap-0 overflow-hidden p-0 sm:max-w-3xl"
        data-testid="vehicle-preview-modal"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Prévia — {titulo}</DialogTitle>
        </DialogHeader>

        <div className="flex max-h-[90dvh] min-h-0 flex-col overflow-hidden md:grid md:max-h-[90dvh] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:grid-rows-1">
          <div className="min-w-0 shrink-0 border-border md:flex md:min-h-0 md:flex-col md:justify-center md:border-r md:p-3">
            <div className="relative mx-auto aspect-[4/3] h-auto max-h-[38dvh] w-full max-w-full overflow-hidden bg-muted md:max-h-[min(45dvh,300px)]">
              <Image
                src={photos[photoIndex] ?? photos[0]}
                alt={`${titulo} — foto ${photoIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 420px"
              />
            </div>
            {photos.length > 1 && (
              <div className="w-full max-w-full min-w-0 border-b border-border md:border-b-0">
                <div className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain p-2 [-webkit-overflow-scrolling:touch]">
                  {photos.slice(0, 8).map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setPhotoIndex(i)}
                      className={cn(
                        "relative size-14 shrink-0 overflow-hidden rounded-md border-2",
                        i === photoIndex ? "border-primary" : "border-transparent",
                      )}
                      aria-label={`Foto ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pt-3 pb-2 md:flex-none md:overflow-visible">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {vehicle.loja.replace("Isavel Veiculos - ", "")}
              </p>
              <h2 className="text-lg font-bold text-primary md:text-xl">
                {titulo}
              </h2>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {vehicle.versao}
              </p>
              <p className="mt-2 text-xl font-bold text-primary md:text-2xl">
                {preco}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {formatAno(vehicle.ano_fabricacao, vehicle.ano_modelo)} ·{" "}
                {formatKm(vehicle.km)} · {vehicle.cambio} · {vehicle.combustivel}
              </p>
            </div>
            <PreviewActions detailPath={detailPath} wa={wa} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-[60] flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full bg-white text-foreground shadow-md ring-1 ring-border md:hidden"
          aria-label="Fechar prévia"
        >
          ✕
        </button>
      </DialogContent>
    </Dialog>
  );
}
