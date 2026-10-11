import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

const environment = process.env.ENV ?? "QA";
dotenv.config({ path: `.env.${environment}` });

const apiBaseUrl = process.env.API_BASE_URL ?? "http://localhost:4000";
const apiVersion = process.env.API_VERSION ?? "/api/v1";
const sandboxApiKey = process.env.SANDBOX_API_KEY;

if (!sandboxApiKey) {
  throw new Error(
    `SANDBOX_API_KEY is missing. Add it to .env.${environment} (use .env.QA.example as a template).`,
  );
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `${apiBaseUrl.replace(/\/$/, "")}${apiVersion}`,
    extraHTTPHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Sandbox-Key": sandboxApiKey,
    },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "api",
      testMatch: "**/api/**/*.spec.ts",
    },
  ],
});
