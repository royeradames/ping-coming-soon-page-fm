import { expect, test } from "@playwright/test";

test("launch heading and submit button keep normal text contrast", async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const ratios = await page.locator("h1 .light, .notify-form button").evaluateAll(elements => {
      const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
        if (!channels || channels.length !== 3) throw new Error(`Unsupported computed color ${color}`);
        const linear = channels.map(channel => {
          const value = channel / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      };
      return elements.map(element => {
        const style = getComputedStyle(element);
        const foreground = luminance(style.color);
        const background = luminance(element instanceof HTMLButtonElement ? style.backgroundColor : getComputedStyle(document.body).backgroundColor);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      });
    });
    expect(ratios).toHaveLength(2);
    for (const ratio of ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
  }
});
