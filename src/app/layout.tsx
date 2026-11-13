import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { Providers } from "@/components/providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const siteUrl = "https://faddsistemas.github.io/isavel-redesign";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Isavel Veículos — Seminovos em Abaeté e Nova Serrana, MG",
    template: "%s | Isavel Veículos",
  },
  description:
    "Compra e venda de carros seminovos e usados em Abaeté e Nova Serrana. Estoque atualizado, financiamento e avaliação do seu veículo.",
  icons: {
    icon: "/isavel-redesign/assets/favicon.png",
  },
  openGraph: {
    images: ["/isavel-redesign/assets/social-share.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <body
        className={`${plusJakarta.className} flex min-h-screen flex-col font-sans antialiased`}
      >
        <Providers>
          <SiteHeader />
          <main className="flex-1 pb-24 md:pb-8">{children}</main>
          <SiteFooter />
          <WhatsAppFab />
        </Providers>
      </body>
    </html>
  );
}
