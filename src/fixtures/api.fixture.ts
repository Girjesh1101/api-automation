import { test as base, expect } from "@playwright/test";
import { ApiClient } from "../api/api-client";
import { AuthApi } from "../api/auth.api";
import { ProductsApi } from "../api/products.api";

type ApiFixtures = {
  apiClient: ApiClient;
  authApi: AuthApi;
  productsApi: ProductsApi;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },

  authApi: async ({ apiClient }, use) => {
    await use(new AuthApi(apiClient));
  },

  productsApi: async ({ apiClient }, use) => {
    await use(new ProductsApi(apiClient));
  },
});

export { expect };
