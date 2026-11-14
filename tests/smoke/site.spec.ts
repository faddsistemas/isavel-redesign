import { test, expect } from "@playwright/test";

const sampleDetail =
  "carros/jeep/renegade-s-t270-1-3-tb-4x4-flex-aut/2023/1174974/";

async function advanceHeroSlide(page: import("@playwright/test").Page) {
  const next = page.getByTestId("hero-carousel-next");
  if (await next.isVisible()) {
    await next.click();
    return;
  }
  await page.getByTestId("hero-carousel-dot-1").click();
}

test.describe("Isavel redesign smoke", () => {
  test("Plus Jakarta Sans carrega (woff2 200 e font-family no body)", async ({
    page,
  }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    await assertPlusJakartaFont(page);
  });

  test("home: após scroll, seções visíveis e mapas com src válido", async ({
    page,
  }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(800);

    const headings = [
      "Marcas no estoque",
      "Destaques",
      "Venda seu carro",
      "Financiamento",
      "O que dizem nossos clientes",
    ];
    for (const name of headings) {
      const h = page.getByRole("heading", { name, exact: true });
      await expect(h).toBeVisible();
      const visible = await h.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 || rect.width === 0) return false;
        let node: HTMLElement | null = el as HTMLElement;
        while (node) {
          const opacity = Number.parseFloat(getComputedStyle(node).opacity);
          if (opacity < 0.99) return false;
          node = node.parentElement;
        }
        return true;
      });
      expect(visible).toBe(true);
    }

    const fadeBlocks = page.locator("[data-fade-in]");
    const fadeCount = await fadeBlocks.count();
    expect(fadeCount).toBeGreaterThan(0);
    for (let i = 0; i < fadeCount; i++) {
      const opacity = await fadeBlocks.nth(i).evaluate((el) =>
        Number.parseFloat(getComputedStyle(el).opacity),
      );
      expect(opacity).toBeGreaterThanOrEqual(0.99);
    }

    const maps = page.locator('footer iframe[title^="Mapa"]');
    await expect(maps).toHaveCount(2);
    for (let i = 0; i < 2; i++) {
      const src = await maps.nth(i).getAttribute("src");
      expect(src).toMatch(/google\.com\/maps/);
      expect(src).toContain("output=embed");
    }
  });

  test("home: prefers-reduced-motion mantém hero e conteúdo visíveis", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./", { waitUntil: "networkidle" });
    await expect(page.getByTestId("hero-carousel")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("hero-search-input")).toBeVisible();

    const heroHeading = page.getByRole("heading", { level: 1 });
    await expect(heroHeading).toBeVisible();
    const heroOpacity = await heroHeading.evaluate((el) => {
      let node: HTMLElement | null = el;
      while (node) {
        const opacity = Number.parseFloat(getComputedStyle(node).opacity);
        if (opacity < 0.99) return opacity;
        node = node.parentElement;
      }
      return 1;
    });
    expect(heroOpacity).toBeGreaterThanOrEqual(0.99);

    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    await page.waitForTimeout(300);

    const destaques = page.getByRole("heading", {
      name: "Destaques",
      exact: true,
    });
    await expect(destaques).toBeVisible();
    const sectionOpacity = await destaques.evaluate((el) => {
      let node: HTMLElement | null = el;
      while (node) {
        const opacity = Number.parseFloat(getComputedStyle(node).opacity);
        if (opacity < 0.99) return opacity;
        node = node.parentElement;
      }
      return 1;
    });
    expect(sectionOpacity).toBeGreaterThanOrEqual(0.99);
  });

  test("home carrega sem overflow e sem erros no console", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("./", { waitUntil: "networkidle" });
    await expect(page.getByTestId("hero-carousel")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId("hero-search-input")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 2,
    );
    expect(overflow).toBe(true);
    expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
  });

  test("hero: cover com fade suave + bbox do carro visível", async ({
    page,
  }, testInfo) => {
    const isMobile = testInfo.project.name.startsWith("mobile");
    const layout = isMobile ? "mobile" : "desktop";

    await page.goto("./", { waitUntil: "networkidle" });
    const carousel = page.getByTestId("hero-carousel");
    await expect(carousel).toBeVisible();
    const pauseBtn = page
      .locator(
        '[data-testid="hero-carousel-pause-desktop"], [data-testid="hero-carousel-pause"]',
      )
      .locator("visible=true")
      .first();
    await pauseBtn.click();
    if (isMobile) {
      await expect(carousel).toHaveAttribute("data-mobile-media-height", /^\d+$/, {
        timeout: 10_000,
      });
    }
    const slideCount = await page.getByTestId(/^hero-carousel-dot-/).count();
    const heroVehicleIds = [
      1024455, 1160040, 1029170, 1056873, 1004365, 1161984,
    ];

    for (let i = 0; i < slideCount; i++) {
      if (i > 0) {
        await page.getByTestId(`hero-carousel-dot-${i}`).click();
        await expect(carousel).toHaveAttribute("data-active-index", String(i), {
          timeout: 5_000,
        });
        if (isMobile) {
          await expect(carousel).toHaveAttribute("data-mobile-media-height", /^\d+$/, {
            timeout: 5_000,
          });
          const vehicleId = heroVehicleIds[i];
          if (vehicleId != null) {
            await page.waitForFunction(
              (id) => {
                const img = document.querySelector(
                  '[data-hero-layout="mobile"] [data-testid="hero-slide-image"]',
                ) as HTMLImageElement | null;
                return Boolean(img?.currentSrc.includes(`/vehicles/${id}/`));
              },
              vehicleId,
              { timeout: 8_000 },
            );
          }
        }
        await page.waitForTimeout(400);
        if (isMobile) {
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      }

      const metrics = await page.evaluate(
        ({ index, layoutName }) => {
          const parsePos = (objectPosition: string) => {
            const parts = objectPosition.trim().split(/\s+/);
            const parse = (token: string | undefined, fallback: number) => {
              if (!token) return fallback;
              if (token.endsWith("%")) return Number.parseFloat(token) / 100;
              if (token === "left" || token === "top") return 0;
              if (token === "right" || token === "bottom") return 1;
              if (token === "center") return 0.5;
              return fallback;
            };
            return { x: parse(parts[0], 0.5), y: parse(parts[1] ?? parts[0], 0.5) };
          };

          const objectCoverImageRect = (
            container: { width: number; height: number },
            imageAspect: number,
            objectPosition: string,
          ) => {
            const { x, y } = parsePos(objectPosition);
            const cw = container.width;
            const ch = container.height;
            const containerAspect = cw / ch;
            if (containerAspect > imageAspect) {
              const height = ch;
              const width = ch * imageAspect;
              const overflow = width - cw;
              return { left: -overflow * x, top: 0, width, height };
            }
            const width = cw;
            const height = cw / imageAspect;
            const overflow = height - ch;
            return { left: 0, top: -overflow * y, width, height };
          };

          const section = document.querySelector(
            '[data-testid="hero-carousel"]',
          ) as HTMLElement | null;
          if (!section || section.getAttribute("data-active-index") !== String(index)) {
            return null;
          }

          const media = section.querySelector(
            '[data-testid="hero-slide-media"]',
          ) as HTMLElement | null;
          const layoutEl = media?.querySelector(
            `[data-hero-layout="${layoutName}"]`,
          ) as HTMLElement | null;
          const img = layoutEl?.querySelector(
            '[data-testid="hero-slide-image"]',
          ) as HTMLImageElement | null;
          const copy = section.querySelector(
            '[data-testid="hero-slide-copy-inner"]',
          ) as HTMLElement | null;
          if (!media || !layoutEl || !img || !copy) return null;

          const dataset =
            layoutEl.getAttribute("data-hero-framing") ??
            media.getAttribute("data-hero-framing");
          if (!dataset) return null;
          const [aspectStr, bboxStr, desktopPos, mobilePos] = dataset.split("|");
          const fallbackAspect = Number.parseFloat(aspectStr);
          const [bl, bt, br, bb] = bboxStr.split(",").map(Number);
          const naturalW = img.naturalWidth > 0 ? img.naturalWidth : 0;
          const naturalH = img.naturalHeight > 0 ? img.naturalHeight : 0;
          const imageAspect =
            naturalW > 0 && naturalH > 0 ? naturalW / naturalH : fallbackAspect;
          const objectPosition =
            layoutName === "desktop"
              ? desktopPos
              : getComputedStyle(img).objectPosition || mobilePos;

          const container = layoutEl.getBoundingClientRect();
          const hero = section.getBoundingClientRect();
          const text = copy.getBoundingClientRect();
          const softEdge = layoutEl.getAttribute("data-hero-soft-edge") === "true";
          const maskImage =
            getComputedStyle(layoutEl).maskImage ||
            getComputedStyle(layoutEl).webkitMaskImage;

          const kenBurns = Boolean(
            layoutEl.querySelector(".hero-ken-burns-contain-max"),
          );

          const local = objectCoverImageRect(
            { width: container.width, height: container.height },
            imageAspect,
            objectPosition,
          );
          const imageRect = {
            left: container.left + local.left,
            top: container.top + local.top,
            width: local.width,
            height: local.height,
          };

          const car = {
            left: imageRect.left + bl * imageRect.width,
            top: imageRect.top + bt * imageRect.height,
            right: imageRect.left + br * imageRect.width,
            bottom: imageRect.top + bb * imageRect.height,
          };

          const visible =
            layoutName === "desktop"
              ? hero
              : {
                  left: container.left,
                  top: container.top,
                  right: container.right,
                  bottom: container.bottom,
                };

          const tol = 1;
          const inside =
            car.left >= visible.left - tol &&
            car.top >= visible.top - tol &&
            car.right <= visible.right + tol &&
            car.bottom <= visible.bottom + tol;

          const overlapText = !(
            car.right <= text.left + 6 ||
            car.left >= text.right - 6 ||
            car.bottom <= text.top + 6 ||
            car.top >= text.bottom - 6
          );

          const mediaBox = media.getBoundingClientRect();

          const carWidth = car.right - car.left;
          const carFillVw =
            layoutName === "mobile" ? carWidth / container.width : null;

          let withinCeiling = true;
          if (layoutName === "mobile" && naturalW > 0 && naturalH > 0) {
            const bboxW_px = (br - bl) * naturalW;
            const ceiling =
              (naturalH * (container.width * 0.96)) / bboxW_px;
            const vh =
              window.innerHeight || section.getBoundingClientRect().height;
            const svhCap = (58 / 100) * vh;
            const allowed = Math.min(ceiling, svhCap) + 4;
            withinCeiling = container.height <= allowed;
          }

          let mediaToTextGap: number | null = null;
          let ctaFooterGap: number | null = null;
          let carBelowHeader = true;
          let fabClearsFooter = true;
          if (layoutName === "mobile") {
            const mediaWrap = section.querySelector(
              '[data-testid="hero-mobile-media-wrap"]',
            ) as HTMLElement | null;
            const destaque = copy.querySelector("p");
            const ctaRow = copy.querySelector(
              '[data-testid="hero-slide-open"]',
            ) as HTMLElement | null;
            const footer = section.querySelector(
              '[data-testid="hero-mobile-footer"]',
            ) as HTMLElement | null;
            const siteHeader = document.querySelector("header");
            if (mediaWrap && destaque) {
              mediaToTextGap =
                destaque.getBoundingClientRect().top -
                mediaWrap.getBoundingClientRect().bottom;
            }
            if (footer && ctaRow) {
              ctaFooterGap =
                footer.getBoundingClientRect().top -
                ctaRow.getBoundingClientRect().bottom;
            }
            if (siteHeader) {
              const hoursBar = siteHeader.previousElementSibling as HTMLElement | null;
              const stackBottom = Math.max(
                siteHeader.getBoundingClientRect().bottom,
                hoursBar?.getBoundingClientRect().bottom ?? 0,
              );
              const safeTop = Math.max(stackBottom, container.top);
              carBelowHeader = car.top >= safeTop - 6;
            }
            const fab = document.querySelector(
              '[data-testid="whatsapp-fab"]',
            ) as HTMLElement | null;
            const pause = section.querySelector(
              '[data-testid="hero-carousel-pause"]',
            ) as HTMLElement | null;
            if (fab && footer && pause) {
              const fr = fab.getBoundingClientRect();
              const pr = pause.getBoundingClientRect();
              const fot = footer.getBoundingClientRect();
              fabClearsFooter =
                fr.left > pr.right + 4 ||
                fr.bottom <= fot.top + 4 ||
                fr.top >= fot.bottom + 4;
            }
          }

          return {
            imgFit: getComputedStyle(img).objectFit,
            hasBlurPanel: Boolean(
              section.querySelector('[data-testid="hero-foreground-box"]'),
            ),
            softEdge: softEdge && maskImage !== "none",
            mediaFullWidth:
              layoutName === "desktop"
                ? mediaBox.width >= hero.width * 0.98
                : container.width >= hero.width * 0.98,
            inside,
            overlapText,
            carFillVw,
            naturalLoaded: naturalW > 0,
            kenBurns,
            withinCeiling,
            mediaToTextGap,
            ctaFooterGap,
            carBelowHeader,
            fabClearsFooter,
            mediaHeight: container.height,
          };
        },
        { index: i, layoutName: layout },
      );

      expect(metrics).not.toBeNull();
      expect(metrics!.hasBlurPanel).toBe(false);
      expect(metrics!.imgFit).toBe("cover");
      expect(metrics!.softEdge).toBe(true);
      expect(metrics!.mediaFullWidth).toBe(true);
      expect(metrics!.inside).toBe(true);
      if (isMobile) {
        expect(metrics!.naturalLoaded, `slide ${i} img natural`).toBe(true);
        expect(metrics!.kenBurns, `slide ${i} ken burns off`).toBe(false);
        expect(metrics!.withinCeiling, `slide ${i} media height`).toBe(true);
        expect(metrics!.carBelowHeader, `slide ${i} teto sob header`).toBe(true);
        expect(
          metrics!.carFillVw,
          `slide ${i} car width ≤ bbox na imagem`,
        ).toBeLessThanOrEqual(0.97);
        if (metrics!.mediaToTextGap != null) {
          expect(
            metrics!.mediaToTextGap,
            `slide ${i} gap mídia–texto`,
          ).toBeLessThanOrEqual(16);
        }
        if (metrics!.ctaFooterGap != null) {
          expect(
            metrics!.ctaFooterGap,
            `slide ${i} gap CTA–rodapé`,
          ).toBeLessThanOrEqual(32);
        }
        expect(
          metrics!.fabClearsFooter,
          `slide ${i} WhatsApp vs controles`,
        ).toBe(true);
      }
      expect(metrics!.overlapText, `slide ${i}`).toBe(false);
    }
  });

  test("carrossel: setas e bolinhas não abrem o modal", async ({ page }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    const modal = page.getByTestId("vehicle-preview-modal");
    const carousel = page.getByTestId("hero-carousel");
    const initial = await carousel.getAttribute("data-active-index");

    await advanceHeroSlide(page);
    await expect(modal).not.toBeVisible();
    await expect(carousel).not.toHaveAttribute("data-active-index", initial ?? "0");

    await page.getByTestId("hero-carousel-dot-2").click();
    await expect(modal).not.toBeVisible();
    await expect(carousel).toHaveAttribute("data-active-index", "2");

    await page.getByTestId("hero-carousel-dot-0").click();
    await page.getByTestId("hero-slide-open").first().click();
    await expect(modal).toBeVisible();
    await page.keyboard.press("Escape");
  });

  test("carrossel e modal abrem e fecham", async ({ page }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    await advanceHeroSlide(page);
    await page.getByTestId("vehicle-card").first().click();
    const modal = page.getByTestId("vehicle-preview-modal");
    await expect(modal).toBeVisible();
    await assertModalFitsViewport(page, modal);
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("modal desktop: CTAs visíveis sem scroll interno", async ({
    page,
  }, testInfo) => {
    test.skip(
      !testInfo.project.name.startsWith("desktop"),
      "somente viewports desktop",
    );
    await page.goto("./", { waitUntil: "networkidle" });
    await page.getByTestId("vehicle-card").first().click();
    const modal = page.getByTestId("vehicle-preview-modal");
    await expect(modal).toBeVisible();

    const scrollInfo = await modal.evaluate((el) => ({
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));
    expect(scrollInfo.scrollHeight).toBeLessThanOrEqual(
      scrollInfo.clientHeight + 2,
    );

    await assertModalFitsViewport(page, modal);
    const ver = modal.getByTestId("preview-ver-anuncio").first();
    const wa = modal.getByTestId("preview-whatsapp").first();
    await assertElementInViewport(page, ver);
    await assertElementInViewport(page, wa);
  });

  test("modal: botões visíveis e sem overflow horizontal", async ({ page }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    await page.getByTestId("vehicle-card").first().click();
    const modal = page.getByTestId("vehicle-preview-modal");
    await expect(modal).toBeVisible();
    await assertModalFitsViewport(page, modal);
  });

  test("estoque filtra por termo", async ({ page }) => {
    await page.goto("estoque/", { waitUntil: "networkidle" });
    await page.getByTestId("stock-search").fill("Jeep");
    await page.getByRole("button", { name: "Buscar" }).click();
    await page.waitForURL(/termo=Jeep/i);
    await expect(page.getByTestId("stock-count")).toContainText(/4 veículo/i);
    await expect(page.getByTestId("vehicle-card")).toHaveCount(4);
  });

  test("anúncio abre com galeria e preço", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(sampleDetail, { waitUntil: "networkidle" });
    await expect(page.getByTestId("vehicle-gallery")).toBeVisible();
    await expect(page.getByTestId("vehicle-price")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 2,
    );
    expect(overflow).toBe(true);
    expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
  });

  test("links internos principais não retornam 404", async ({ page }) => {
    const routes = [
      "./",
      "estoque/",
      "venda-seu-carro/",
      "financie/",
      "sobre/",
      "termos/",
      "privacidade/",
      sampleDetail,
    ];
    for (const route of routes) {
      const res = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(res?.status(), route).toBeLessThan(400);
    }
  });
});

async function assertPlusJakartaFont(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => {
      const ff = getComputedStyle(document.body).fontFamily.toLowerCase();
      return ff.includes("plus jakarta");
    },
    { timeout: 10_000 },
  );
  const fontFamily = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );
  expect(fontFamily.toLowerCase()).toContain("plus jakarta sans");

  const woff2Href = await page.evaluate(() => {
    const preload = document.querySelector('link[rel="preload"][as="font"]');
    if (preload?.getAttribute("href")?.includes(".woff2")) {
      return preload.getAttribute("href");
    }
    for (const sheet of [...document.styleSheets]) {
      try {
        for (const rule of [...sheet.cssRules]) {
          if (rule instanceof CSSFontFaceRule) {
            const src = rule.style.getPropertyValue("src");
            const match = src.match(/url\(["']?([^"')]+\.woff2)/);
            if (match?.[1]) return match[1];
          }
        }
      } catch {
        /* cross-origin sheet */
      }
    }
    return null;
  });
  expect(woff2Href).toBeTruthy();
  const fontUrl = new URL(woff2Href!, page.url()).toString();
  const response = await page.request.get(fontUrl);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"] ?? "").toMatch(/font|octet-stream/i);
}

async function assertElementInViewport(
  page: import("@playwright/test").Page,
  locator: import("@playwright/test").Locator,
) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  const viewport = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 2);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 2);
  expect(box!.y).toBeGreaterThanOrEqual(-2);
}

async function assertModalFitsViewport(
  page: import("@playwright/test").Page,
  modal: import("@playwright/test").Locator,
) {
  const modalMetrics = await modal.evaluate((el) => ({
    scrollWidth: el.scrollWidth,
    clientWidth: el.clientWidth,
  }));
  expect(modalMetrics.scrollWidth).toBeLessThanOrEqual(
    modalMetrics.clientWidth + 1,
  );

  const ver = modal.getByTestId("preview-ver-anuncio").first();
  const wa = modal.getByTestId("preview-whatsapp").first();
  await expect(ver).toBeVisible();
  await expect(wa).toBeVisible();

  const viewport = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));

  for (const btn of [ver, wa]) {
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.x).toBeGreaterThanOrEqual(-2);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 2);
    expect(box!.y).toBeGreaterThanOrEqual(-2);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height + 2);
  }
}
