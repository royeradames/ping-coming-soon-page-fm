import { expect, test } from "@playwright/test";

// The page validates one email address. Its first load must not carry zod's error
// messages for every other language: with `import { z } from "zod"` Turbopack keeps the
// whole namespace, locales included (about 80 KB gzipped, 365 KB to parse on a phone).
test("the first load carries no foreign-language zod locale", async ({ page }) => {
  const scripts = new Set<string>();
  page.on("response", response => {
    if (response.request().resourceType() === "script") scripts.add(response.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Notify Me" }).waitFor();
  expect(scripts.size).toBeGreaterThan(0);
  const bodies = await Promise.all([...scripts].map(url => page.evaluate(async u => (await fetch(u)).text(), url)));
  const carriers = [...scripts].filter((_, i) => bodies[i].includes("Ungültige Eingabe"));
  expect(carriers, "scripts that carry zod's German locale").toEqual([]);
});
