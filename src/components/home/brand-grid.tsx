import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { MarcaCount } from "@/lib/vehicles";

interface BrandGridProps {
  marcas: MarcaCount[];
}

export function BrandGrid({ marcas }: BrandGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {marcas.map((m) => (
        <li key={m.marca_slug}>
          <Link href={`/estoque/?marca=${m.marca_slug}`}>
            <Card className="flex min-h-20 flex-col items-center justify-center gap-1 border-border/80 p-3 text-center shadow-none transition hover:border-primary hover:shadow-sm">
              <span className="text-sm font-bold text-foreground">{m.marca}</span>
              <span className="text-xs text-muted-foreground">
                {m.count} {m.count === 1 ? "unidade" : "unidades"}
              </span>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
