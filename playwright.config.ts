import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  use: { baseURL: "http://localhost:3100" },
  webServer: {
    command: "node scripts/serve-static.mjs 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
  },
  projects: [
    { name: "handy-chromium", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "handy-webkit", use: { ...devices["iPhone 14"], viewport: { width: 390, height: 844 } } },
    { name: "schmal", use: { browserName: "chromium", viewport: { width: 360, height: 740 } } },
    { name: "tablet", use: { browserName: "chromium", viewport: { width: 820, height: 1180 } } },
    { name: "desktop", use: { browserName: "chromium", viewport: { width: 1360, height: 900 } } },
  ],
});
