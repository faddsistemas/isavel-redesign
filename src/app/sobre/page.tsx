import type { Metadata } from "next";
import Link from "next/link";
import { STORES, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a história da Isavel Veículos — 29 anos de tradição em Abaeté e Nova Serrana, MG.",
};

const HISTORIA = `Isavel Veículos nasceu da paixão de Cirino Gomes por carros e o seu desejo de fazer parte de um segmento em expansão. Há 29 anos atrás tinha início uma longa e próspera caminhada em busca do sucesso e qualidade no atendimento ao público de Abaeté e região.

Com o passar do tempo, o nome Isavel Veículos foi se consolidando e tornou-se referência no comércio de automóveis. Muitas amizades e parcerias foram construídas, sonhos foram realizados e metas atingidas.

Graças à um contínuo processo de amadurecimento e aprendizado, nossa empresa encontra-se cada dia mais motivada e engajada em oferecer um alto nível de serviço aos nossos clientes e amigos que estiveram conosco todo esse período.

O objetivo da Isavel Veículos é continuar sendo sinônimo de qualidade e confiança no mercado durante as próximas décadas. Por isso, hoje contamos com espaço próprio em Abaeté e Nova Serrana, grandes parcerias e apoio de bancos e financeiras para melhor atender aos nossos consumidores por todo o estado.

Trabalhamos com o comércio de veículos novos e seminovos, importados e nacionais, das mais variadas marcas. Entre em contato conosco e venha fazer-nos uma visita!`;

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Sobre a Isavel Veículos</h1>
      <div className="space-y-4">
        {HISTORIA.split("\n\n").map((p) => (
          <p key={p.slice(0, 24)} className="leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </div>
      <section className="mt-10 rounded-xl border border-border bg-white p-6">
        <h2 className="text-lg font-bold text-primary">Contato</h2>
        <p className="mt-2 text-sm text-muted-foreground">{STORES.abaete.address}</p>
        <p className="mt-2 text-sm">
          WhatsApp:{" "}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {WHATSAPP_DISPLAY}
          </a>
        </p>
        <Link
          href="/estoque/"
          className={cn(buttonVariants({ size: "lg" }), "mt-4 inline-flex")}
        >
          Ver estoque
        </Link>
      </section>
    </div>
  );
}
