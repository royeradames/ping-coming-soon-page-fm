import { expect, test } from "@playwright/test";

const emptyMessage = "Whoops! It looks like you forgot to add your email";
const invalidMessage = "Please provide a valid email address";

test("renders the logo, launch heading, sign-up form, dashboard and footer", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Ping coming soon | Royer Adames");
  await expect(page.getByRole("img", { name: "Ping", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("We are launching soon!");
  await expect(page.getByText("Subscribe and get notified")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email address" })).toHaveAttribute("placeholder", "Your email address…");
  await expect(page.getByRole("button", { name: "Notify Me" })).toBeVisible();
  await expect(page.getByText("Demo only: nothing is sent.")).toBeVisible();
  const dashboard = page.getByRole("img", { name: /Preview of the Ping dashboard/ });
  await dashboard.scrollIntoViewIfNeeded();
  await expect(dashboard).toBeVisible();
  await expect.poll(() => dashboard.evaluate(element => (element as HTMLImageElement).complete && (element as HTMLImageElement).naturalWidth > 0)).toBe(true);
  for (const name of ["Facebook", "Twitter", "Instagram"]) await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
  await expect(page.getByText("© Copyright Ping. All rights reserved.")).toBeVisible();
});

test("an empty submit shows the challenge's empty message, keeps focus on the field and sends nothing", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  const button = page.getByRole("button", { name: "Notify Me" });
  await button.click();
  await expect(page.getByText(emptyMessage)).toBeVisible();
  await expect(email).toBeFocused();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toHaveAccessibleDescription(`${emptyMessage} Demo only: nothing is sent.`);
  await expect(email).toHaveCSS("border-top-color", "rgb(200, 47, 68)");
  await expect(button).toBeEnabled();
  expect(new URL(page.url()).search).toBe("");
  expect(writes).toEqual([]);
});

test("a malformed address shows the invalid message, then clears as the address is fixed", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  await email.fill("example@email/com");
  await page.keyboard.press("Enter");
  await expect(page.getByText(invalidMessage)).toBeVisible();
  for (const bad of ["name@host", "name.host.tld", "@host.tld"]) {
    await email.fill(bad);
    await expect(page.getByText(invalidMessage)).toBeVisible();
  }
  await email.fill("name@host.tld");
  await expect(page.getByText(invalidMessage)).toBeHidden();
  await expect(email).not.toHaveAttribute("aria-invalid", "true");
});

test("a valid address is accepted honestly: nothing is sent and the field resets", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  await email.fill("  name@host.tld ");
  await page.getByRole("button", { name: "Notify Me" }).click();
  await expect(page.getByRole("status")).toHaveText("That address looks right. Demo only: nothing was sent or saved.");
  await expect(email).toHaveValue("");
  await expect(page.getByText(emptyMessage)).toBeHidden();
  expect(writes).toEqual([]);
});

test("hover and focus states follow the active-states frame", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Notify Me" });
  await expect(button).toHaveCSS("background-color", "rgb(53, 104, 220)");
  await button.hover();
  await expect(button).toHaveCSS("background-color", "rgb(45, 95, 207)");
  const twitter = page.getByRole("link", { name: "Twitter", exact: true });
  await twitter.hover();
  await expect(twitter).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.mouse.move(0, 0);
  await expect(twitter).toHaveCSS("color", "rgb(53, 104, 220)");
  await page.getByRole("textbox", { name: "Email address" }).focus();
  await page.keyboard.press("Tab");
  await expect(button).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Facebook", exact: true })).toBeFocused();
});

test("follows the mobile and desktop frames, including the error layouts", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const email = page.getByRole("textbox", { name: "Email address" });
  const button = page.getByRole("button", { name: "Notify Me" });
  const mobileEmail = await email.boundingBox();
  const mobileButton = await button.boundingBox();
  expect(mobileEmail!.width).toBeCloseTo(282, 0);
  expect(mobileButton!.y).toBeGreaterThan(mobileEmail!.y + mobileEmail!.height);
  await button.click();
  await expect(page.locator(".email-error")).toHaveCSS("text-align", "center");

  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto("/");
  const desktopEmail = await email.boundingBox();
  const desktopButton = await button.boundingBox();
  expect(desktopEmail!.width).toBeCloseTo(421, 0);
  expect(desktopEmail!.height).toBeCloseTo(56, 0);
  expect(desktopButton!.width).toBeCloseTo(200, 0);
  expect(desktopButton!.y).toBeCloseTo(desktopEmail!.y, 0);
  expect(desktopButton!.x - (desktopEmail!.x + desktopEmail!.width)).toBeCloseTo(16, 0);
  expect((await page.locator(".dashboard").boundingBox())!.width).toBeCloseTo(640, 0);
  await expect(page.locator("h1")).toHaveCSS("font-size", "48px");
  await button.click();
  await expect(page.locator(".email-error")).toHaveCSS("text-align", "left");
  expect((await button.boundingBox())!.height).toBeCloseTo(56, 0);
});

test("fits from 320 to 1440 with no overflow, 16px text and 44px targets", async ({ page }) => {
  for (const width of [320, 375, 400, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Notify Me" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const smallText = await page.locator("h1, p, input, button, footer a").evaluateAll(elements =>
      elements.filter(element => element.getClientRects().length > 0 && parseFloat(getComputedStyle(element).fontSize) < 16).map(element => element.textContent));
    expect(smallText).toEqual([]);
    for (const control of await page.locator("a, button, input").all()) {
      const box = await control.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("declares Ping as the one site name in the logo, og:site_name and WebSite JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header img")).toHaveAttribute("alt", "Ping");
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", "Ping");
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: "Ping", url: "https://ping-coming-soon-page-fm.royeradames.com/" });
});

test("with JavaScript disabled, submitting never puts the address in the URL or sends it", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const writes: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") writes.push(request.url()); });
  try {
    await page.goto("http://127.0.0.1:4536/");
    await page.getByRole("textbox", { name: "Email address" }).fill("name@host.tld");
    await page.getByRole("button", { name: "Notify Me" }).click();
    await page.waitForLoadState();
    expect(page.url()).not.toContain("host.tld");
    expect(page.url()).not.toContain("email");
    expect(writes).toEqual([]);
  } finally {
    await context.close();
  }
});
