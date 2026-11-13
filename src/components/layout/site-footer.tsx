import Link from "next/link";
import {
  CNPJ,
  EMAIL,
  SOCIAL,
  STORES,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <StoreBlock store={STORES.abaete} />
        <StoreBlock store={STORES.novaSerrana} />
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-white/90 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Isavel Veículos — CNPJ {CNPJ}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/termos/"
              className="text-white underline-offset-4 hover:underline"
            >
              Termos
            </Link>
            <Link
              href="/privacidade/"
              className="text-white underline-offset-4 hover:underline"
            >
              Privacidade
            </Link>
            <a
              href={SOCIAL.instagram}
              className="text-white underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="bg-black px-4 py-3 text-center text-xs text-white/80">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="text-white"
          aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
        >
          WhatsApp: {WHATSAPP_DISPLAY}
        </a>
        {" · "}
        <a href={`mailto:${EMAIL}`} className="text-white">
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}

function StoreBlock({
  store,
}: {
  store: (typeof STORES)["abaete"] | (typeof STORES)["novaSerrana"];
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-white">{store.name}</h2>
      <p className="text-sm text-white/85">{store.address}</p>
      <p className="text-sm">
        <a
          href={`tel:${store.phoneRaw}`}
          className="text-white underline-offset-4 hover:underline"
        >
          {store.phone}
        </a>
      </p>
      <div className="overflow-hidden rounded-lg border border-white/20">
        <iframe
          title={`Mapa — ${store.short}`}
          src={store.mapEmbed}
          className="h-48 w-full border-0 bg-white/10"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          data-testid={`map-embed-${store.short.toLowerCase().replace(/\s+/g, "-")}`}
        />
      </div>
      <a
        href={store.mapSearch}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white underline-offset-4 hover:underline"
      >
        Abrir no Google Maps
      </a>
    </section>
  );
}
