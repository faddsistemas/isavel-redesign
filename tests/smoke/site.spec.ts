import { test, expect } from "@playwright/test";

const sampleDetail =
  "carros/jeep/renegade-s-t270-1-3-tb-4x4-flex-aut/2023/1174974/";

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

  test("carrossel: setas e bolinhas não abrem o modal", async ({ page }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    const modal = page.getByTestId("vehicle-preview-modal");
    const carousel = page.getByTestId("hero-carousel");
    const initial = await carousel.getAttribute("data-active-index");

    await page.getByTestId("hero-carousel-next").click();
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
    await page.getByTestId("hero-carousel-next").click();
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
