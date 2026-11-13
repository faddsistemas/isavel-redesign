# Identidade — Isavel Veículos

Coletado em 13/11/2026, 00h09 (horário de Brasília), a partir do HTML, do tema injetado no Next.js e das APIs Autoconf (`/api/dealer`, `/api/home`).

## Nome

- Nome publicado: **Isavel Veiculos - Abaeté** (sem acento no “Veiculos”, como no site e no schema).
- No texto da página Sobre: **Isavel Veículos**.
- Filial: **Isavel Veiculos - Nova Serrana**.
- Fundador citado na história: **Cirino Gomes**.
- CNPJ (rodapé e `/api/dealer`): **22.356.653/0001-40** (`22356653000140`).
- Slug Autoconf: `isavel-veiculos` (matriz, id 942) e `isavel-veiculos-filial` (id 955).

Não há slogan formal cadastrado. O posicionamento no `<title>` e na meta description é:

> Carros usados, seminovos em Abaeté — Compra e venda.
> Isavel Veiculos - Abaeté revenda de carros seminovos e usados em Abaeté e região. Compramos seu carro, traga para uma avaliação.

## Logo e arquivos

Baixados em `/workspace/redesign/isavel/assets/`:

| Arquivo | Origem | Tamanho |
|---|---|---|
| `logo.png` | https://assets.autoconf.net.br/sites/isavel-veiculos/logo.png | 278×70 px, RGB |
| `favicon.png` | https://assets.autoconf.net.br/sites/isavel-veiculos/favicon.png | 192×189 px (também usado como apple-touch-icon) |
| `social-share.jpg` | https://assets.autoconf.net.br/sites/isavel-veiculos/social-share.jpg | 1200×630 px (Open Graph / Twitter) |

O logotipo é wordmark + ícone em azul-marinho sobre fundo claro. Cor dominante no PNG: cerca de `#002868` (alinha com o `--bs-primary` `#002969`). **Não há vermelho no logo.**

## Cores (tema real, não o default do CSS)

Valores aplicados em runtime no `<body>` e no objeto `theme` do layout:

| Token | Hex | Uso |
|---|---|---|
| Primária `--bs-primary` | `#002969` | Faixa de horário, botões, preço em destaque, identidade |
| Contraste da primária | `#ffffff` | Texto sobre a primária |
| Secundária `--bs-secondary` | `#212121` | Texto/ênfase secundária (quase preto; **não** é o vermelho `#b82025` do template Autoconf) |
| Contraste da secundária | `#ffffff` | |
| Menu fundo `--header-menu-bg` | `#FFFFFF` | Barra do logo e da navegação |
| Menu texto `--header-menu-text` | `#000000` | Links do menu |
| Faixa de horário fundo | `#002969` | “Horário de atendimento: Segunda-feira a Sexta-feira: 8h às 18h” |
| Faixa de horário texto | `#ffffff` | |
| Heading (CSS) | `#212121` | Títulos |
| WhatsApp (CSS do template) | `#25D366` / `#128C4A` | Botão flutuante e links de WhatsApp |
| Rodapé legal | `#000000` | Faixa “© 2026 Autoconf…” — ver problema de contraste no diagnóstico |

O CSS ainda declara defaults de template (`--bs-primary: #4f4d4d`, `--bs-secondary: #b82025`), mas o tema da Isavel **sobrescreve** isso. Usar `#002969` + `#212121` + menu branco.

## Tipografia

- Família real: **Plus Jakarta Sans** (400, 500, 600, 700), via `next/font` (`/_next/static/media/plus-jakarta-sans-*.woff2`).
- A variável CSS se chama `--font-montserrat`, mas o `font-family` apontado é Plus Jakarta Sans — o nome da variável é resquício do template, não Montserrat de fato.
- Fallback: `ui-sans-serif, system-ui, sans-serif`.

## Contato

### Isavel Veiculos - Abaeté (matriz)

- Endereço: Praça Edgardo Abreu, 35, Amazonas, Abaeté, MG, CEP 35620-000
- Telefone: **(37) 3541-3000** (`3735413000`)
- WhatsApp / celular: **(37) 98802-8801** (`5537988028801` / `37988028801`)
- E-mail: **isavelabaete@yahoo.com.br**
- Horário publicado: **segunda a sexta, 8h às 18h**. Sábado e domingo fechados (o objeto `businessHours` do tema confirma `sat` e `sun` com `closed: true`).
- Mapa embutido (só esta loja): Google Maps embed “Isavel Veículos”, coords aproximadas 19,155° S / 45,443° W.
- Link de busca no Maps: `https://www.google.com/maps/search/?api=1&query=Praça%20Edgardo%20Abreu,%2035,%20Amazonas,%20Abaeté,%20MG,%2035620000`

### Isavel Veiculos - Nova Serrana (filial)

- Endereço (rodapé visível e `/api/dealer`): Benjamin Martins do Espírito Santo, 2513, Park Dona Gumercinda Martins, Nova Serrana, MG, CEP 35524-119
- Telefone: **(37) 3226-4600** (`3732264600`)
- WhatsApp / celular: o mesmo **(37) 98802-8801**
- E-mail: o mesmo **isavelabaete@yahoo.com.br**
- Horário: o mesmo, seg–sex 8h às 18h
- Observação: no bloco `footer.unidades` do tema, os campos da filial vieram vazios; o endereço correto está no rodapé HTML e na API `/api/dealer`. Não há embed de mapa desta loja.

### Redes

- Instagram: https://www.instagram.com/isavelveiculos/ (a API também usa `?hl=pt-br`)
- Facebook: https://www.facebook.com/IsavelVeiculos
- YouTube: https://www.youtube.com/@isavelveiculos
- Beacons (banners da home): https://beacons.ai/isavel
- TikTok: não cadastrado (`null`)

Analytics publicado: Google tags `G-4D9FTQL3MW` e `G-L2D403VMJT`, mais um preload inválido `G-XXXXXXXXXX`.

## História (texto integral da página Sobre)

> Isavel Veículos nasceu da paixão de Cirino Gomes por carros e o seu desejo de fazer parte de um segmento em expansão. Há 29 anos atrás tinha início uma longa e próspera caminhada em busca do sucesso e qualidade no atendimento ao público de Abaeté e região.
>
> Com o passar do tempo, o nome Isavel Veículos foi se consolidando e tornou-se referência no comércio de automóveis. Muitas amizades e parcerias foram construídas, sonhos foram realizados e metas atingidas.
>
> Graças à um contínuo processo de amadurecimento e aprendizado, nossa empresa encontra-se cada dia mais motivada e engajada em oferecer um alto nível de serviço aos nossos clientes e amigos que estiveram conosco todo esse período.
>
> O objetivo da Isavel Veículos é continuar sendo sinônimo de qualidade e confiança no mercado durante as próximas décadas. Por isso, hoje contamos com espaço próprio em Abaeté e Nova Serrana, grandes parcerias e apoio de bancos e financeiras para melhor atender aos nossos consumidores por todo o estado.
>
> Trabalhamos com o comércio de veículos novos e seminovos, importados e nacionais, das mais variadas marcas. Entre em contato conosco e venha fazer-nos uma visita!

## Depoimentos no site (não é nota do Google)

Não há widget, nota nem quantidade de avaliações do Google no site. Há 3 depoimentos cadastrados no Autoconf, com foto:

1. **Bernardo Vasconcelos** — atendimento em Divinópolis-MG; o texto publicado termina no meio da frase (“Novamente”).
2. **Marisa Alves** — cliente há mais de 20 anos; recomenda a loja.
3. **Laura** — cita o consultor Gustavo; o texto também está cortado (“me enviaram uma opção de outra marca,”).

Fotos em `https://autoconf-production.s3.amazonaws.com/site_depoimento/942/…`.

## Parceiros de financiamento (página Financie)

Banco Pan, Bradesco, BV, C6, Daycoval, Itaú, Safra, Santander. O texto da home: “Trabalhamos com as principais financeiras, isso garante melhores taxas para você!”
