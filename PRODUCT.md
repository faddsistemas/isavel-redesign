# Isavel Redesign — Produto

Site estático para **Isavel Veículos** (Abaeté e Nova Serrana, MG). Redesign com foco em busca, filtros e contato rápido, inspirado em padrões de usabilidade de marketplaces automotivos **sem copiar** layout, código ou textos de terceiros.

## Páginas entregues

| Rota | Função |
|------|--------|
| `/` | Home: busca, marcas com estoque, destaques, depoimentos, CTAs |
| `/estoque/` | Lista com busca, filtros, ordenação e filtro por loja |
| `/{tipo}/{marca}/{modelo}/{ano}/{id}/` | Anúncio com galeria e fichas |
| `/venda-seu-carro/` | Formulário de avaliação (lead) |
| `/financie/` | Pedido de análise de crédito com bancos parceiros — **sem simulador** |
| `/sobre/` | História institucional |
| `/termos/` | Termos de uso |
| `/privacidade/` | Política de privacidade |

## O que NÃO existe (e não deve ser criado)

- Simulador / calculadora de parcelas
- Nota ou widget do Google
- Blog, login, favoritos, test-drive, chat próprio, checkout
- Veículos ou marcas fora do estoque real (`data/vehicles.json`)

## Formulários (site estático)

Todos os envios abrem o **WhatsApp** `(37) 98802-8801` com a mensagem pré-preenchida. Não há backend nem POST para APIs da Autoconf.

## Identidade

- Azul-marinho `#002969`, texto `#212121`, **Plus Jakarta Sans**
- Logo, favicon e fotos do cliente em `public/`
- Duas lojas com mapas embed (Google Maps)

## Modal de prévia

Na home e no estoque, ao clicar no card abre modal com galeria, dados principais, “Ver anúncio completo” e “Chamar no WhatsApp”. Fecha ao navegar.

## Deploy

GitHub Pages: https://faddsistemas.github.io/isavel-redesign/
