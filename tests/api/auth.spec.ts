import { test, expect } from "../../src/fixtures/api.fixture";
import type { RegisterRequest } from "../../src/types/api.types";

const demoEmail = process.env.DEMO_EMAIL;
const demoPassword = process.env.DEMO_PASSWORD;

test.describe("Auth API", () => {
  test("registers a new user", async ({ authApi }) => {
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const payload: RegisterRequest = {
      name: "API Automation User",
      email: `api.automation.${uniqueSuffix}@example.test`,
      password: `StrongPass!${uniqueSuffix.slice(-4)}aA`,
    };

    const { response, data } = await authApi.register(payload);

    // Confirm this status and payload against your local OpenAPI contract.
    expect(response.status()).toBe(201);
    expect(data).toBeDefined();
  });

  test("rejects weak registration password", async ({ authApi }) => {
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const { response, data } = await authApi.register({
      name: "Weak Password User",
      email: `weak.password.${uniqueSuffix}@example.test`,
      password: "123",
    });

    expect(response.status()).toBe(422);
    expect(data).toBeDefined();
  });

  test("rejects invalid login credentials", async ({ authApi }) => {
    const { response, data } = await authApi.login({
      email: `missing.${Date.now()}@example.test`,
      password: "WrongPassword!123",
    });

    expect(response.status()).toBe(401);
    expect(data).toBeDefined();
  });

  test("login, profile, logout, and revoked-session behavior", async ({
    authApi,
  }) => {
    test.skip(
      !demoEmail || !demoPassword,
      "Set DEMO_EMAIL and DEMO_PASSWORD in .env.QA",
    );

    const loginResult = await authApi.login({
      email: demoEmail as string,
      password: demoPassword as string,
    });

    expect(loginResult.response.status()).toBe(200);
    const token = authApi.getAccessToken(loginResult.data);

    const profileResult = await authApi.me(token);
    expect(profileResult.response.status()).toBe(200);
    expect(profileResult.data).toBeDefined();

    const logoutResult = await authApi.logout(token);
    expect([200, 204]).toContain(logoutResult.response.status());

    const profileAfterLogout = await authApi.me(token);
    // The documented behavior says logout revokes the session.
    expect(profileAfterLogout.response.status()).toBe(401);
  });
});
