"use client";

import { Phone } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PHONE_ABAETE_RAW } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface MobileContactBarProps {
  priceLabel?: string;
  whatsappMessage?: string;
}

export function MobileContactBar({
  priceLabel,
  whatsappMessage = "Olá! Tenho interesse em um veículo do site Isavel.",
}: MobileContactBarProps) {
  const wa = buildWhatsAppUrl(whatsappMessage);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-white p-3 shadow-lg md:hidden"
      data-testid="mobile-contact-bar"
    >
      {priceLabel ? (
        <p className="min-w-0 flex-1 truncate text-sm font-bold text-primary">
          {priceLabel}
        </p>
      ) : (
        <p className="flex-1 text-xs font-medium text-muted-foreground">
          Fale com a loja
        </p>
      )}
      <a
        href={`tel:${PHONE_ABAETE_RAW}`}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "min-h-11")}
      >
        <Phone data-icon="inline-start" className="size-4" />
        Ligar
      </a>
      <Link
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ size: "sm" }),
          "min-h-11 shrink-0 bg-[#128C4A] text-white hover:bg-[#0f7040]",
        )}
      >
        WhatsApp
      </Link>
    </div>
  );
}
