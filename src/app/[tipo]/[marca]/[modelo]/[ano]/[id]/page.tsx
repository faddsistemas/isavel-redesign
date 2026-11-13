import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { MobileContactBar } from "@/components/layout/mobile-contact-bar";
import { WhatsAppLeadForm } from "@/components/forms/whatsapp-lead-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatAno, formatKm, formatPreco } from "@/lib/format";
import {
  getSameBrandSuggestions,
  getStaticVehicleParams,
  getVehicleById,
  localPhotoPaths,
  vehiclePathFromUrl,
} from "@/lib/vehicles";
import { buildWhatsAppUrl, vehicleInterestMessage } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { VehicleRouteParams } from "@/lib/types";

type PageProps = {
  params: Promise<VehicleRouteParams>;
};

export function generateStaticParams() {
  return getStaticVehicleParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = getVehicleById(Number(id));
  if (!vehicle) return { title: "Veículo não encontrado" };
  return {
    title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano_modelo}`,
    description: `${vehicle.versao} — ${formatPreco(vehicle.preco)} na Isavel Veículos.`,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const routeParams = await params;
  const vehicle = getVehicleById(Number(routeParams.id));
  if (!vehicle) notFound();

  const path = vehiclePathFromUrl(vehicle);
  const expected = path.split("/").filter(Boolean);
  const matches =
    expected[0] === routeParams.tipo &&
    expected[1] === routeParams.marca &&
    expected[2] === routeParams.modelo &&
    expected[3] === routeParams.ano &&
    expected[4] === routeParams.id;
  if (!matches) notFound();

  const photos = localPhotoPaths(vehicle);
  const titulo = `${vehicle.marca} ${vehicle.modelo}`;
  const preco = formatPreco(vehicle.preco);
  const suggestions = getSameBrandSuggestions(vehicle);
  const waMessage = vehicleInterestMessage(`${titulo} — ${vehicle.versao}`, preco);
  const wa = buildWhatsAppUrl(waMessage);

  const specs = [
    ["Ano", formatAno(vehicle.ano_fabricacao, vehicle.ano_modelo)],
    ["Quilometragem", formatKm(vehicle.km)],
    ["Câmbio", vehicle.cambio],
    ["Combustível", vehicle.combustivel],
    ["Cor", vehicle.cor],
    ["Carroceria", vehicle.carroceria],
    ["Portas", String(vehicle.portas)],
    ["Loja", vehicle.loja.replace("Isavel Veiculos - ", "")],
  ] as const;

  const destaques = vehicle.acessorios.filter((a) => a.destaque);
  const demais = vehicle.acessorios.filter((a) => !a.destaque);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 pb-28 md:pb-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <VehicleGallery photos={photos} title={titulo} />
          <div className="mt-6 flex flex-col gap-2 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge variant="secondary" className="mb-2 w-fit">
                {vehicle.tipo}
              </Badge>
              <h1 className="text-2xl font-bold text-primary md:text-3xl">{titulo}</h1>
              <p className="text-muted-foreground">{vehicle.versao}</p>
            </div>
            <p className="text-3xl font-bold text-primary" data-testid="vehicle-price">
              {preco}
            </p>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ficha técnica</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b border-border/60 py-2 text-sm">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {(destaques.length > 0 || demais.length > 0) && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Opcionais e itens de série</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                  {[...destaques, ...demais].map((a) => (
                    <li key={a.slug} className="text-foreground">
                      {a.nome}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {suggestions.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-lg font-bold text-primary">
                Mais {vehicle.marca} no estoque
              </h2>
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {suggestions.map((v) => (
                  <li key={v.id}>
                    <VehicleCard vehicle={v} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <Card className="sticky top-24 hidden border-primary/20 md:block">
            <CardContent className="flex flex-col gap-3 p-6">
              <p className="text-2xl font-bold text-primary">{preco}</p>
              <Link
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "min-h-11 w-full")}
              >
                Chamar no WhatsApp
              </Link>
              <Link
                href="/financie/"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-h-11 w-full")}
              >
                Solicitar financiamento
              </Link>
              <Separator />
              <WhatsAppLeadForm
                title="Envie uma mensagem"
                messagePrefix={`Interesse no veículo: ${titulo} (${preco})`}
                submitLabel="Enviar pelo WhatsApp"
                fields={[
                  { name: "nome", label: "Nome", required: true },
                  { name: "telefone", label: "Telefone / WhatsApp", required: true },
                  { name: "mensagem", label: "Mensagem", placeholder: "Sua dúvida..." },
                ]}
              />
            </CardContent>
          </Card>
        </aside>
      </div>

      <MobileContactBar priceLabel={preco} whatsappMessage={waMessage} />
    </div>
  );
}
