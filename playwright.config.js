import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  forbidOnly: process.env.CI !== undefined,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  reporter: process.env.CI !== undefined ? "html" : "list",
  retries: process.env.CI !== undefined ? 2 : 0,
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run start -- --host",
    reuseExistingServer: process.env.CI === undefined,
    url: "http://127.0.0.1:5173",
  },
});
