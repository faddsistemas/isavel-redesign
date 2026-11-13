# Mapa do site original — isavel.com.br

Coletado em 13/11/2026, 00h09 (horário de Brasília). Plataforma: **Autoconf** (https://www.autoconf.com.br/), site id / revenda matriz **942**, filial **955**. Front em Next.js (App Router) atrás do Cloudflare. Inventário, filtros e anúncios vêm das APIs da própria Autoconf no domínio do cliente — não é iframe de terceiro.

Sitemap oficial (`https://isavel.com.br/sitemap.xml`): só 6 rotas institucionais. Os 27 anúncios **não entram** no sitemap.

`robots.txt` permite tudo (`User-agent: * / Allow: /`).

Base canônica observada: `https://www.isavel.com.br` e `https://isavel.com.br` (mesmo app).

---

## Páginas e rotas que EXISTEM

### Menu principal (nesta ordem)

Configurado no tema: Home, Estoque, Venda Seu Carro, Financie, Sobre. No header visível, o item "Home" não aparece como texto (o logo leva para `/`).

| Rota | Menu / footer | O que contém |
|---|---|---|
| `/` | Logo / Home | Faixa de horário, header (logo, menu, telefone, WhatsApp), carrossel de banners, busca, atalhos de marca, "Últimas novidades", depoimentos, CTAs de vender e financiar, redes, rodapé com as 2 lojas e 1 mapa (Abaeté). |
| `/estoque/` | Menu e CTA | Lista do estoque, "Filtrar", "Ordenar por". O HTML inicial só mostra "Carregando estoque..."; os cards vêm de `/api/stock` e `/api/filters`. |
| `/venda-seu-carro/` | Menu | Formulário de avaliação + 3 opções de negócio (veja fluxo abaixo). |
| `/financie/` | Menu | Texto institucional, logos de bancos, 3 passos do processo e formulário de **solicitação de análise** (não é calculadora de parcela). |
| `/sobre/` | Menu | História da empresa (Cirino Gomes, 29 anos, lojas em Abaeté e Nova Serrana) e bloco de contato (WhatsApp e telefone de Abaeté). |
| `/termos/` | Footer | Termos de uso (texto padrão Autoconf, personalizado com o nome da loja e o e-mail). |
| `/privacidade/` | Footer | Política de privacidade (idem; cita Google Analytics / cookies). |

### Anúncio (detalhe do veículo)

Padrão (função do front Autoconf):

`/{tipo_slug}/{marca_slug}/{modelo_slug}/{ano_modelo}/{id}/`

Exemplo real: `https://www.isavel.com.br/carros/jeep/renegade-s-t270-1-3-tb-4x4-flex-aut/2023/1174974/`

A página SSR só mostra "Carregando...". O conteúdo vem de `GET /api/veiculo?id={id}` e `GET /api/dealer`.

No anúncio existem: galeria de fotos, preço, ano, km, câmbio, combustível, cor, carroceria, portas, opcionais, descrição, loja, CTAs de mensagem, WhatsApp, ligar, endereço, botão de financiar, compartilhar e sugestões da mesma marca. Também há formulário "Envie uma mensagem ao vendedor" (`POST /api/detail-contact`).

### APIs lidas (GET, uso interno do site)

| Endpoint | Uso |
|---|---|
| `/api/home` | Banners, depoimentos, destaques, marcas da home |
| `/api/stock` | Estoque paginado (27 itens no total; `registros_por_pagina` padrão 18) |
| `/api/filters` | Opções de filtro e contagens |
| `/api/veiculo?id=` | Detalhe de um veículo |
| `/api/dealer` | Dados das duas lojas |

POST (não disparei, só identifiquei no JS): `/api/whatsapp`, `/api/sell`, `/api/finance`, `/api/finance/contact`, `/api/detail-contact`.

---

## Fluxos do usuário

### 1. Buscar e filtrar

1. Na home, o campo **"Qual veículo você está buscando?"** envia `GET /estoque?termo=...`.
2. Atalhos de marca vão para `/estoque/?marca={slug}`.
3. Em `/estoque/` o visitante filtra e ordena. Parâmetros observados no front: `termo`, `tipo`/`tipos`, `marca`/`marcas`, `modelo`/`modelos`, `ano_min`, `ano_max`, `cambio`/`cambios`, `combustivel`/`combustiveis`, `cor`/`cores`, `carroceria`/`carrocerias`, `opcionais`, `revenda`/`revendas`, `ordenacao`, `pagina`, `registros_por_pagina`.
4. Filtros disponíveis hoje: loja (Abaeté 14 / Nova Serrana 13), tipo (Carros 26 / Motos 1), 8 marcas com estoque, modelos, carroceria, ano, faixa de preço, cor, câmbio, combustível, 70 opcionais, ordenação (Relevância, Marca/Modelo, Menor/Maior preço, Ano mais novo, Menor KM). Tudo o que está no estoque é seminovo (`filtrosBuscaTipo: seminovo`).
5. O card leva ao anúncio ("Ver mais").

### 2. Ver o veículo e falar com a loja

1. Abre o anúncio (URL acima).
2. Pode: enviar mensagem, chamar no WhatsApp (`wa.me/5537988028801`, texto do tipo "Tenho interesse neste carro: …"), ligar, ver o endereço da loja do anúncio, compartilhar ou abrir o financiamento.
3. Há botão flutuante de WhatsApp em todas as páginas: abre modal de captura (Nome + Telefone/WhatsApp) e depois redireciona ao `wa.me`. Telefone do header: `(37) 3541-3000`.

### 3. Vender o carro (`/venda-seu-carro/`)

Formulário: dados do veículo (ex.: "Gol 2018") + nome, celular, WhatsApp, e-mail. Envio em `POST /api/sell`.

Passos anunciados: "Entramos em contato" → "Avaliamos seu veículo" → "Fechamos negócio".

Três opções de negócio (texto da própria página):

- **Venda na hora** — compra à vista.
- **Troco na troca** — troca por outro de maior ou menor valor.
- **Consignação** — anunciam nos portais e, na venda, o cliente recebe à vista.

### 4. Financiar (`/financie/`)

Não é simulador de parcela. O visitante preenche um lead e pede análise. Campos: dados do veículo, nome, celular, WhatsApp, e-mail, data de nascimento (opcional), CPF (opcional). Botão **"Solicitar análise"** (`POST /api/finance`).

Bancos exibidos: Banco Pan, Bradesco, BV, C6, Daycoval, Itaú, Safra, Santander.

Passos: Pesquisa de taxas → Aprovação → Assinar contrato com a loja.

No anúncio existe um botão de financiar à parte (`POST /api/finance/contact`), com campos de entrada e parcelas (12/24/36/48/60). O template Autoconf também prevê widget Credere (real ou "modo demonstração" com valores fictícios). Não confirmei no browser qual desses modos está ligado nesta loja; a página `/financie/` em si continua sendo só o formulário de análise.

---

## O que EXISTE (não omitir no redesenho)

- Home com busca, marcas, destaques, depoimentos, CTAs de vender e financiar.
- Estoque com busca, filtros, ordenação e filtro por loja.
- Anúncio individual com galeria, ficha, opcionais, contato e financiar.
- Página **Venda Seu Carro** com formulário e as 3 modalidades.
- Página **Financie** com bancos parceiros e formulário de análise.
- Página **Sobre** com o texto institucional.
- Termos e Privacidade.
- Duas lojas (Abaeté e Nova Serrana).
- WhatsApp, telefone e e-mail reais.
- Instagram, Facebook, YouTube e Beacons (`https://beacons.ai/isavel`).
- Botão flutuante de WhatsApp com captura de lead.
- Estoque de carros **e** 1 quadriciclo/UTV BRP classificado como "Motos".

## O que NÃO existe (não inventar)

- **Simulador de parcela com cálculo ao vivo na página /financie.** Essa tela é só pedido de análise. Não copiar a calculadora do Webmotors.
- Widget de **nota/avaliações do Google** (só há 3 depoimentos cadastrados no Autoconf, sem estrela nem nota).
- Blog, notícias ou central de conteúdo.
- Login, conta do usuário ou página de favoritos (a API tem campo `favorito`, mas não há UI de conta).
- Agendamento de test-drive como página ou item de menu.
- Chat além do WhatsApp.
- Checkout / pagamento online.
- Atendimento no sábado ou domingo (o site declara só seg–sex, 8h às 18h).
- Mapa embutido da loja de Nova Serrana (o embed do rodapé é só de Abaeté).

---

## Inventário publicado em 13/11/2026 (27 veículos)

Faixa de preço no estoque: R$ 45.000 a R$ 235.000. 14 em Abaeté, 13 em Nova Serrana. Lista completa e fotos: `vehicles.json`.

| ID | Veículo | Ano fab/mod | KM | Preço | Loja | Tipo |
|---|---|---|---|---|---|---|
| 1007964 | BRP DEFENDER HD8 | 2018/2018 | 3.645 km | R$ 118.900 | Abaeté | Motos |
| 1143213 | Chevrolet JOY Plus Black Ed.1.0 8V 4p Flex Mec. | 2021/2021 | 75.278 km | R$ 61.900 | Abaeté | Carros |
| 1160083 | Chevrolet ONIX SEDAN Plus LTZ 1.0 12V TB Flex Mec. | 2022/2023 | 79.825 km | R$ 69.900 | Abaeté | Carros |
| 1160087 | Chevrolet ONIX HATCH LT 1.0 12V TB Flex 5p Mec. | 2021/2022 | 57.985 km | R$ 68.900 | Abaeté | Carros |
| 1160071 | Fiat CRONOS DRIVE 1.3 8V Flex Aut. | 2023/2023 | 129.235 km | R$ 78.900 | Abaeté | Carros |
| 1168668 | Fiat Strada Volcano 1.3 Flex 8V CD | 2021/2022 | 53.850 km | R$ 98.800 | Abaeté | Carros |
| 1056873 | Fiat Toro Ultra 1.3 16V 4x2 TB Flex Aut. | 2025/2026 | 19.600 km | R$ 171.900 | Abaeté | Carros |
| 1116248 | Honda Fit EX/S 1.5 Flex/Flexone 16V 5p Aut. | 2012/2012 | 168.825 km | R$ 51.900 | Abaeté | Carros |
| 585207 | Jeep COMPASS LONGITUDE 2.0 4x4 Dies. 16V Aut. | 2018/2019 | 93.955 km | R$ 97.900 | Abaeté | Carros |
| 1111553 | Jeep Renegade Longitude 2.0 4x4 TB Diesel Aut | 2019/2019 | 52.530 km | R$ 89.900 | Abaeté | Carros |
| 1024455 | Toyota Hilux CD SR 4x4 2.8 TDI Diesel Aut. | 2024/2025 | 25.225 km | R$ 235.000 | Abaeté | Carros |
| 1160040 | Toyota Hilux CD SR 4x4 2.8 TDI Diesel Aut. | 2025/2025 | 30.465 km | R$ 221.900 | Abaeté | Carros |
| 1160048 | Toyota YARIS XS Connect Sedan 1.5 Flex 16V Aut. | 2021/2022 | 158.461 km | R$ 84.900 | Abaeté | Carros |
| 1111766 | Volkswagen T-Cross Hig. 250 TSI 1.4 Flex 16V 5p Aut | 2023/2024 | 44.990 km | R$ 127.900 | Abaeté | Carros |
| 1161960 | Chevrolet ONIX HATCH LT 1.0 12V Flex 5p Mec. | 2023/2024 | 24.950 km | R$ 68.900 | Nova Serrana | Carros |
| 910082 | Chevrolet SPIN LT 1.8 8V Econo.Flex 5p Aut. | 2020/2021 | 142.000 km | R$ 76.900 | Nova Serrana | Carros |
| 1111556 | Fiat MOBI LIKE 1.0 Fire Flex 5p. | 2022/2023 | 77.305 km | R$ 52.500 | Nova Serrana | Carros |
| 1116211 | Fiat Palio Week. ATTRACTIVE 1.4 Fire Flex 8V | 2012/2013 | 130.085 km | R$ 45.000 | Nova Serrana | Carros |
| 1029170 | Fiat Toro Ranch 2.2 16V 4x4 TB Diesel Aut. | 2025/2026 | 23.550 km | R$ 194.900 | Nova Serrana | Carros |
| 1107436 | Fiat Toro Volcano 1.3 T270 4x2 Flex Aut. | 2021/2022 | 85.615 km | R$ 114.400 | Nova Serrana | Carros |
| 524479 | Fiat Toro Volcano 2.0 16V 4x4 TB Diesel Aut. | 2016/2017 | 113.285 km | R$ 91.900 | Nova Serrana | Carros |
| 693490 | Ford Fiesta TIT./TIT.Plus 1.6 16V Flex Aut. | 2015/2016 | 97.800 km | R$ 50.900 | Nova Serrana | Carros |
| 1161984 | Jeep COMPASS Lon Nig. Eagle 1.3 4x2 Flex Aut. | 2025/2025 | 25.947 km | R$ 135.900 | Nova Serrana | Carros |
| 1174974 | Jeep Renegade S T270 1.3 TB 4x4 Flex Aut. | 2022/2023 | 29.546 km | R$ 106.900 | Nova Serrana | Carros |
| 886174 | Toyota Corolla XEi 2.0 Flex 16V Aut. | 2020/2021 | 100.950 km | R$ 119.900 | Nova Serrana | Carros |
| 696882 | Volkswagen Polo 1.0 MPI Flex 12V 5p | 2023/2023 | 99.225 km | R$ 78.900 | Nova Serrana | Carros |
| 1004365 | Volkswagen TIGUAN Allspac R-Line 350 TSI 2.0 4x4 | 2020/2021 | 79.687 km | R$ 170.900 | Nova Serrana | Carros |

**Inconsistência:** a home (`/api/home`) ainda destaca a Toyota Hilux CD SRX 4x4 2.8 TDI 16V Diesel Aut. 2026 (id `1161413`, R$ 299.000, Abaeté), que **não está** no estoque atual.

**Atalho morto:** a home SSR lista a marca **BYD**, mas não há nenhum BYD no estoque nem em `/api/filters`.
