import type { Metadata } from "next";
import { EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de privacidade",
};

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Política de privacidade</h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          A {SITE_NAME} respeita a privacidade dos visitantes deste site. Os dados informados em formulários são
          utilizados apenas para contato comercial, via WhatsApp ou telefone, sobre veículos e serviços da loja.
        </p>
        <p>
          Este site estático não armazena formulários em servidor próprio. Ao enviar um formulário, você é
          redirecionado ao WhatsApp com a mensagem preenchida, nos termos da Meta/WhatsApp.
        </p>
        <p>
          Podemos utilizar cookies de análise de audiência em futuras integrações, sempre em conformidade com a
          legislação aplicável. Você pode solicitar informações ou exclusão de dados de contato já compartilhados
          conosco pelo e-mail {EMAIL}.
        </p>
      </div>
    </div>
  );
}
