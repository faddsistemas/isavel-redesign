import type { Metadata } from "next";
import { EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Termos de uso</h1>
      <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Bem-vindo ao site da {SITE_NAME}. Ao utilizar este site, você concorda com os termos abaixo.
        </p>
        <p>
          O conteúdo publicado (preços, fotos e disponibilidade) refere-se ao estoque na data da última atualização.
          A loja reserva-se o direito de alterar valores e retirar anúncios sem aviso prévio.
        </p>
        <p>
          As imagens são meramente ilustrativas do veículo anunciado. Consulte sempre um vendedor para confirmar
          especificações e condições.
        </p>
        <p>
          É vedado o uso do site para fins ilícitos, envio de spam ou tentativa de comprometer a segurança da
          plataforma.
        </p>
        <p>
          Dúvidas sobre estes termos: {EMAIL}.
        </p>
      </div>
    </div>
  );
}
