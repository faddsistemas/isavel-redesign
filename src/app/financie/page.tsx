import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppLeadForm } from "@/components/forms/whatsapp-lead-form";
import { BANCOS_FINANCE } from "@/lib/constants";
import { withBasePath } from "@/lib/base-path";

export const metadata: Metadata = {
  title: "Financie",
  description:
    "Solicite análise de financiamento com os bancos parceiros da Isavel Veículos.",
};

const STEPS = [
  "Pesquisamos as melhores taxas com nossos parceiros",
  "Você recebe a aprovação de crédito",
  "Assinamos o contrato na loja",
] as const;

export default function FinanciePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-primary">Financiamento</h1>
      <p className="mb-6 text-muted-foreground">
        Trabalhamos com as principais financeiras, isso garante melhores taxas para você!
        Preencha o pedido de análise e a equipe retorna pelo WhatsApp.
      </p>
      <div className="mb-8 flex flex-wrap gap-3">
        {BANCOS_FINANCE.map((banco) => (
          <span
            key={banco}
            className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground"
          >
            {banco}
          </span>
        ))}
      </div>
      <ol className="mb-8 list-decimal space-y-2 pl-5 text-sm text-foreground">
        {STEPS.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <div className="mb-6 overflow-hidden rounded-xl border border-border">
        <Image
          src={withBasePath("/assets/logo.png")}
          alt=""
          width={278}
          height={70}
          className="mx-auto bg-white p-6"
          aria-hidden
        />
      </div>
      <WhatsAppLeadForm
        title="Solicitar análise"
        intro="Envie seus dados pelo WhatsApp. Nossa equipe retorna com as opções disponíveis."
        messagePrefix="Solicitação de análise de financiamento"
        submitLabel="Solicitar análise pelo WhatsApp"
        fields={[
          { name: "veiculo", label: "Veículo de interesse", required: true },
          { name: "nome", label: "Nome", required: true },
          { name: "celular", label: "Celular", required: true },
          { name: "whatsapp", label: "WhatsApp" },
          { name: "email", label: "E-mail", type: "email" },
          { name: "nascimento", label: "Data de nascimento" },
          { name: "cpf", label: "CPF" },
        ]}
      />
    </div>
  );
}
