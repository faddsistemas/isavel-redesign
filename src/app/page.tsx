import Link from "next/link";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HeroSearch } from "@/components/home/hero-search";
import { BrandGrid } from "@/components/home/brand-grid";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { FadeIn } from "@/components/motion/fade-in";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TESTIMONIALS } from "@/lib/constants";
import {
  getFeaturedVehicles,
  getMarcasComEstoque,
  VEHICLE_COUNT,
} from "@/lib/vehicles";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const featured = getFeaturedVehicles(6);
  const marcas = getMarcasComEstoque();
  const latest = getFeaturedVehicles(4);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8">
      <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <HeroCarousel vehicles={featured} />
        <HeroSearch />
      </section>

      <FadeIn>
        <section>
          <h2 className="mb-4 text-lg font-bold text-primary">Marcas no estoque</h2>
          <BrandGrid marcas={marcas} />
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-primary">Destaques</h2>
              <p className="text-sm text-muted-foreground">
                {VEHICLE_COUNT} veículos seminovos nas lojas de Abaeté e Nova Serrana
              </p>
            </div>
            <Link href="/estoque/" className={cn(buttonVariants({ variant: "outline" }))}>
              Ver estoque completo
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((v) => (
              <li key={v.id}>
                <VehicleCard vehicle={v} />
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>

      <FadeIn>
        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="border-primary/20 bg-primary text-primary-foreground">
            <CardContent className="flex flex-col gap-3 p-6">
              <h2 className="text-xl font-bold">Venda seu carro</h2>
              <p className="text-sm text-white/90">
                Avaliação justa, venda na hora, troca com troco ou consignação.
              </p>
              <Link
                href="/venda-seu-carro/"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "mt-2 w-full bg-white text-primary hover:bg-white/90",
                )}
              >
                Solicitar avaliação
              </Link>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="flex flex-col gap-3 p-6">
              <h2 className="text-xl font-bold text-primary">Financiamento</h2>
              <p className="text-sm text-muted-foreground">
                Parceria com as principais financeiras. Solicite análise sem compromisso — sem simulador, atendimento humano.
              </p>
              <Link
                href="/financie/"
                className={cn(buttonVariants({ size: "lg" }), "mt-2 w-full")}
              >
                Solicitar análise
              </Link>
            </CardContent>
          </Card>
        </section>
      </FadeIn>

      <FadeIn>
        <section>
          <h2 className="mb-4 text-lg font-bold text-primary">O que dizem nossos clientes</h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <li key={t.name}>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm text-foreground">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-3 text-sm font-semibold text-primary">{t.name}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn>
    </div>
  );
}
