import type { Metadata } from "next";
import { WhatsAppLeadForm } from "@/components/forms/whatsapp-lead-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Venda seu carro",
  description:
    "Avalie e venda seu veículo na Isavel Veículos — venda na hora, troca com troco ou consignação.",
};

const OPTIONS = [
  {
    title: "Venda na hora",
    text: "Compra à vista com pagamento após avaliação presencial.",
  },
  {
    title: "Troco na troca",
    text: "Troque por outro veículo de maior ou menor valor, com ajuste na diferença.",
  },
  {
    title: "Consignação",
    text: "Anunciamos seu carro nos portais e, na venda, você recebe à vista.",
  },
] as const;

export default function VendaSeuCarroPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-primary">Venda seu carro</h1>
      <p className="mb-8 text-muted-foreground">
        Preencha o formulário e nossa equipe retorna pelo WhatsApp para avaliar seu veículo.
      </p>
      <ul className="mb-8 grid gap-4 sm:grid-cols-3">
        {OPTIONS.map((o) => (
          <li key={o.title}>
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold text-primary">{o.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{o.text}</p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      <ol className="mb-8 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
        <li>Entramos em contato</li>
        <li>Avaliamos seu veículo</li>
        <li>Fechamos o negócio</li>
      </ol>
      <WhatsAppLeadForm
        title="Solicitar avaliação"
        messagePrefix="Quero vender meu veículo"
        submitLabel="Enviar pelo WhatsApp"
        fields={[
          { name: "veiculo", label: "Veículo (ex.: Gol 2018)", required: true },
          { name: "nome", label: "Nome", required: true },
          { name: "celular", label: "Celular", required: true },
          { name: "whatsapp", label: "WhatsApp" },
          { name: "email", label: "E-mail", type: "email" },
        ]}
      />
    </div>
  );
}
