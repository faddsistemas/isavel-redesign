import Link from "next/link";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HeroSearch } from "@/components/home/hero-search";
import { BrandGrid } from "@/components/home/brand-grid";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import {
  FadeIn,
  FadeInStagger,
  FadeInStaggerItem,
} from "@/components/motion/fade-in";
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
  <>
      <HeroCarousel vehicles={featured} />

      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-14 sm:gap-24 sm:py-20">
        <section id="busca-veiculo" className="scroll-mt-28">
          <HeroSearch />
        </section>

        <FadeIn>
          <section className="section-premium">
            <h2 className="section-title">Marcas no estoque</h2>
            <BrandGrid marcas={marcas} />
          </section>
        </FadeIn>

        <FadeIn>
          <section className="section-premium">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="section-title mb-2">Destaques</h2>
                <p className="max-w-xl text-base text-muted-foreground">
                  {VEHICLE_COUNT} veículos seminovos nas lojas de Abaeté e Nova
                  Serrana
                </p>
              </div>
              <Link
                href="/estoque/"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "transition-colors duration-200",
                )}
              >
                Ver estoque completo
              </Link>
            </div>
            <FadeInStagger as="ul" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((v) => (
                <FadeInStaggerItem key={v.id} as="li">
                  <VehicleCard vehicle={v} />
                </FadeInStaggerItem>
              ))}
            </FadeInStagger>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="grid gap-6 sm:grid-cols-2">
            <Card className="overflow-hidden rounded-2xl border-primary/20 bg-primary text-primary-foreground transition-shadow duration-200 hover:shadow-lg">
              <CardContent className="flex flex-col gap-4 p-8">
                <h2 className="text-2xl font-bold">Venda seu carro</h2>
                <p className="text-sm leading-relaxed text-white/90">
                  Avaliação justa, venda na hora, troca com troco ou consignação.
                </p>
                <Link
                  href="/venda-seu-carro/"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "mt-2 w-full bg-white text-primary transition-colors duration-200 hover:bg-white/90",
                  )}
                >
                  Solicitar avaliação
                </Link>
              </CardContent>
            </Card>
            <Card className="overflow-hidden rounded-2xl border-border transition-shadow duration-200 hover:shadow-lg">
              <CardContent className="flex flex-col gap-4 p-8">
                <h2 className="text-2xl font-bold text-primary">Financiamento</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Trabalhamos com as principais financeiras, isso garante melhores
                  taxas para você!
                </p>
                <Link
                  href="/financie/"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-2 w-full transition-colors duration-200",
                  )}
                >
                  Solicitar análise
                </Link>
              </CardContent>
            </Card>
          </section>
        </FadeIn>

        <FadeIn>
          <section className="section-premium">
            <h2 className="section-title mb-8">O que dizem nossos clientes</h2>
            <FadeInStagger as="ul" className="grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <FadeInStaggerItem key={t.name} as="li">
                  <Card className="h-full rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-sm leading-relaxed text-foreground">
                        &ldquo;{t.text}&rdquo;
                      </p>
                      <p className="mt-4 text-sm font-semibold text-primary">
                        {t.name}
                      </p>
                    </CardContent>
                  </Card>
                </FadeInStaggerItem>
              ))}
            </FadeInStagger>
          </section>
        </FadeIn>
      </div>
    </>
  );
}