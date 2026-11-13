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
        className="box-border max-h-[min(92vh,720px)] w-full max-w-[calc(100vw-1.5rem)] min-w-0 gap-0 overflow-x-hidden overflow-y-hidden p-0 sm:max-w-lg"
        data-testid="vehicle-preview-modal"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>
            Prévia — {titulo}
          </DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[min(92vh,720px)] min-w-0 max-w-full flex-col overflow-x-hidden">
          <div className="relative aspect-[4/3] w-full max-w-full min-w-0 shrink-0 overflow-hidden bg-muted">
            <Image
              src={photos[photoIndex] ?? photos[0]}
              alt={`${titulo} — foto ${photoIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
          {photos.length > 1 && (
            <div className="w-full max-w-full min-w-0 border-b border-border">
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
          <div className="flex min-w-0 max-w-full flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto p-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {vehicle.loja.replace("Isavel Veiculos - ", "")}
              </p>
              <h2 className="text-xl font-bold text-primary">{titulo}</h2>
              <p className="text-sm text-muted-foreground">{vehicle.versao}</p>
            </div>
            <p className="text-2xl font-bold text-primary">{preco}</p>
            <p className="text-sm text-foreground">
              {formatAno(vehicle.ano_fabricacao, vehicle.ano_modelo)} ·{" "}
              {formatKm(vehicle.km)} · {vehicle.cambio} · {vehicle.combustivel}
            </p>
            <div
              className="mt-auto flex w-full min-w-0 max-w-full flex-col gap-2 pt-2 sm:flex-row sm:items-stretch"
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
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-[60] flex size-11 items-center justify-center rounded-full bg-white text-foreground shadow-md ring-1 ring-border md:hidden"
          aria-label="Fechar prévia"
        >
          ✕
        </button>
      </DialogContent>
    </Dialog>
  );
}
