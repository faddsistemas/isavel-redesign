export const SITE_NAME = "Isavel Veículos";
export const WHATSAPP_NUMBER = "5537988028801";
export const WHATSAPP_DISPLAY = "(37) 98802-8801";
export const PHONE_ABAETE = "(37) 3541-3000";
export const PHONE_ABAETE_RAW = "3735413000";
export const PHONE_NOVA_SERRANA = "(37) 3226-4600";
export const EMAIL = "isavelabaete@yahoo.com.br";
export const CNPJ = "22.356.653/0001-40";
export const HORARIO =
  "Horário de atendimento: Segunda-feira a Sexta-feira: 8h às 18h";

export const STORES = {
  abaete: {
    name: "Isavel Veículos — Abaeté",
    short: "Abaeté",
    address:
      "Praça Edgardo Abreu, 35, Amazonas, Abaeté, MG, CEP 35620-000",
    phone: PHONE_ABAETE,
    phoneRaw: PHONE_ABAETE_RAW,
    mapEmbed:
      "https://www.google.com/maps?q=Pra%C3%A7a+Edgardo+Abreu,+35,+Amazonas,+Abaet%C3%A9,+MG&output=embed",
    mapSearch:
      "https://www.google.com/maps/search/?api=1&query=Praça%20Edgardo%20Abreu,%2035,%20Amazonas,%20Abaeté,%20MG,%2035620-000",
  },
  novaSerrana: {
    name: "Isavel Veículos — Nova Serrana",
    short: "Nova Serrana",
    address:
      "Benjamin Martins do Espírito Santo, 2513, Park Dona Gumercinda Martins, Nova Serrana, MG, CEP 35524-119",
    phone: PHONE_NOVA_SERRANA,
    phoneRaw: "3732264600",
    mapEmbed:
      "https://www.google.com/maps?q=Benjamin+Martins+do+Esp%C3%ADrito+Santo,+2513,+Park+Dona+Gumercinda+Martins,+Nova+Serrana,+MG&output=embed",
    mapSearch:
      "https://www.google.com/maps/search/?api=1&query=Benjamin%20Martins%20do%20Esp%C3%ADrito%20Santo,%202513,%20Nova%20Serrana,%20MG",
  },
} as const;

export const SOCIAL = {
  instagram: "https://www.instagram.com/isavelveiculos/",
  facebook: "https://www.facebook.com/IsavelVeiculos",
  youtube: "https://www.youtube.com/@isavelveiculos",
  beacons: "https://beacons.ai/isavel",
} as const;

export const BANCOS_FINANCE = [
  "Banco Pan",
  "Bradesco",
  "BV",
  "C6",
  "Daycoval",
  "Itaú",
  "Safra",
  "Santander",
] as const;

export const ORDENACAO_OPTIONS = [
  { value: "relevancia", label: "Relevância" },
  { value: "marca-modelo", label: "Marca / Modelo" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "ano-novo", label: "Ano mais novo" },
  { value: "menor-km", label: "Menor KM" },
] as const;

export type OrdenacaoValue = (typeof ORDENACAO_OPTIONS)[number]["value"];

export const TESTIMONIALS = [
  {
    name: "Marisa Alves",
    text:
      "Sou cliente há mais de 20 anos e sempre fui muito bem atendida. Recomendo a Isavel Veículos de olhos fechados.",
  },
  {
    name: "Bernardo Vasconcelos",
    text:
      "Excelente atendimento em Divinópolis-MG. Processo transparente do início ao fim.",
  },
  {
    name: "Laura",
    text:
      "O consultor Gustavo me ajudou a encontrar o carro certo. Atendimento atencioso e rápido.",
  },
] as const;
