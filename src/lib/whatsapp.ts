import { WHATSAPP_NUMBER } from "@/lib/constants";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function vehicleInterestMessage(
  titulo: string,
  preco: string,
  url?: string,
): string {
  const lines = [
    "Olá, Isavel Veículos!",
    "",
    `Tenho interesse neste veículo: ${titulo}`,
    `Preço: ${preco}`,
  ];
  if (url) lines.push(`Link: ${url}`);
  lines.push("", "Aguardo retorno.");
  return lines.join("\n");
}
