import { test, expect } from "@playwright/test";

const sampleDetail =
  "carros/jeep/renegade-s-t270-1-3-tb-4x4-flex-aut/2023/1174974/";

test.describe("Isavel redesign smoke", () => {
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

  test("carrossel e modal abrem e fecham", async ({ page }) => {
    await page.goto("./", { waitUntil: "networkidle" });
    await page.getByTestId("hero-carousel").getByRole("button", { name: /Próximo/i }).click();
    await page.getByTestId("vehicle-card").first().click();
    const modal = page.getByTestId("vehicle-preview-modal");
    await expect(modal).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
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
