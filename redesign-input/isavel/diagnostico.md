# Diagnóstico — isavel.com.br

Coletado em 13/11/2026, 00h10 (horário de Brasília). A API pública do PageSpeed Insights (`googleapis.com/pagespeedinsights`) respondeu 404 neste ambiente. Rodei Lighthouse 12 local, mobile, na home `https://www.isavel.com.br/`: **Performance 0,90**, **Acessibilidade 0,93**, **SEO 1,00**. O 1,00 de SEO é o checklist básico do Lighthouse (título, meta, robots, viewport) e **não** captura o fato de estoque e anúncios não serem SSR e não entrarem no sitemap.

## Top 8 problemas (com correção proposta)

1. **Estoque, destaques e anúncio só existem depois do JavaScript** (Nielsen 1 — visibilidade do status; SEO). `/estoque/` começa em “Carregando estoque...”, o anúncio em “Carregando...”, a home busca destaques em `/api/home`. Sem JS não há carros. O sitemap tem só 6 URLs institucionais e ignora os 27 anúncios. JSON-LD da loja às vezes vai com `"url":""`. TTI mobile da home: **12,3 s**.  
   **Correção:** gerar estoque, cards da home e anúncios no HTML estático (o stack do redesign já é Next com `output: 'export'`), incluir cada veículo no sitemap e preencher o schema.

2. **Hero é carrossel de banners, não busca de carro** (Jakob, Hick). O primeiro conteúdo — e o LCP, 3,2 s, um banner 720×400 que aponta para Beacons — é propaganda de redes sociais (Beacons, Instagram, YouTube). A busca “Qual veículo você está buscando?” existe, mas fica abaixo. O visitante que chega para comprar precisa procurar o campo.  
   **Correção (padrão Webmotors, porque a busca e os filtros já existem no site original):** hero com busca na frente, filtros rápidos (marca, faixa de preço, loja) e CTA para o estoque. Banners, se permanecerem, ficam em segundo plano e com peso menor.

3. **Informação falsa ou morta na home** (Nielsen 1 e 8 — precisão e design minimalista). (a) “Últimas novidades” inclui a Hilux SRX 2026 id `1161413` (R$ 299.000), que **não está** no estoque. (b) Há atalho da marca **BYD** com zero veículos. (c) Dois dos três depoimentos estão cortados no próprio cadastro.  
   **Correção:** destacar só o que está em `/api/stock`, ocultar marca sem quantidade, publicar depoimentos completos (ou encurtar de propósito, com reticências conscientes).

4. **Hierarquia do card e alvo de clique fracos** (Fitts, hierarquia visual). O card tem foto, nome, preço e um “Ver mais” pequeno. Não há WhatsApp nem telefone no card, embora esses canais existam no site. No mobile, o caminho até o contato é card → anúncio (ainda carregando) → CTA.  
   **Correção:** card inteiro clicável, preço e ano/km com hierarquia clara, e CTA de WhatsApp no card (o canal já é da loja). Vale um modal resumido antes do anúncio completo, no mesmo espírito do que foi feito na FV, porque o anúncio original já existe.

5. **CTA de contato não é persistente o bastante no anúncio** (Fitts, mobile-first). WhatsApp flutuante e captura de lead existem, o que é bom. Mas o anúncio é client-side; Ligar, mensagem, WhatsApp e financiar só aparecem depois do fetch. No footer, o mapa é só de Abaeté — quem olha a filial de Nova Serrana não vê o mapa.  
   **Correção:** barra fixa no mobile do anúncio (WhatsApp + ligar + preço), SSR da ficha, e bloco das duas lojas com mapa também de Nova Serrana (o endereço já está publicado).

6. **Contraste WCAG AA quebrado no rodapé legal** (Lighthouse color-contrast: 0). Os links “Termos” e “Privacidade” usam a primária `#002969` sobre fundo `bg-black` — contraste **1,52:1** (precisa 4,5:1). O número de WhatsApp do rodapé falhou em `label-content-name-mismatch` (texto visível “(37) 98802-8801” ≠ nome acessível).  
   **Correção:** texto/links do rodapé preto em branco ou branco/claro no preto; `aria-label` alinhado ao que a pessoa lê.

7. **Alvos de toque minúsculos no carrossel e JS/imagens pesados** (Fitts, WCAG 2.5.8, performance). Dots do banner: 8×8 px (mínimo 24×24). Imagens mal dimensionadas (~194 KiB) e JS não usado (~354 KiB). Há preload de um GTM placeholder `G-XXXXXXXXXX` além das tags reais.  
   **Correção:** dots com área de toque ≥ 24 px; imagens no tamanho certo e em formato moderno (já há webp no CDN, mas nem todas as originais aproveitam); não carregar tag falsa; reduzir JS de template que o site estático não precisa.

8. **Financiamento opaco, fácil de piorar se copiarmos o Webmotors** (Nielsen 8; lição da FV). `/financie/` é um pedido de análise (veículo + contato + CPF opcional), não uma calculadora de parcela. Inventar simulador “tipo Webmotors” seria criar uma tela que o cliente original não tem — e foi exatamente o erro evitado na FV. O anúncio tem botão de financiar (entrada + prazos ou Credere); o template ainda tem um “modo demonstração” com parcelas fictícias, que seria pior se estiver ligado.  
   **Correção:** manter a página e o fluxo de **solicitar análise**, com os bancos que a loja já lista. No anúncio, o botão de financiar pode abrir um formulário claro, nunca um cálculo inventado. Se no futuro a loja tiver Credere de verdade, aí sim integra; não simular resultado falso.

## Outros pontos (mais curtos)

- Títulos repetitivos (“Estoque - Isavel Veiculos - Abaeté em Abaeté - … | Isavel Veiculos - Abaeté”).
- Menu “Home” está no tema e não aparece; o header mostra Estoque / Venda / Financie duas vezes em contextos diferentes.
- Cinzas do template (`#9c9c9c` em branco) ficam abaixo de 4,5:1 — evitar em texto pequeno.
- Horário de sábado fechado está no tema, mas a faixa do topo só diz “segunda a sexta”; não precisa inventar plantão.

## Padrões de usabilidade do Webmotors que CABEM aqui

Só onde o site original já tem o conteúdo ou a função:

- **Busca no hero** e filtros (marca, preço, ano, loja, câmbio, etc.) — a busca e o `/estoque/` já existem.
- **Hierarquia de card** (foto, preço, ano/km, CTA) — o estoque já é o coração do site.
- **CTA de contato fixo** (WhatsApp / ligar) — os números e o botão flutuante já existem.
- **Galeria + ficha no anúncio**, com caminho curto para o WhatsApp.
- **Venda do usado** e **financiamento como lead**, no mesmo recorte das páginas atuais, sem inventar calculadora.
- **Filtro por loja**, já que há duas unidades.

Não aplicar, porque o original não tem: nota do Google, conta/favoritos, blog, test-drive como tela, checkout, atendimento no fim de semana.
