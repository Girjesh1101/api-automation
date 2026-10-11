import { test, expect } from "../../src/fixtures/api.fixture";
import type { ProductListResponse } from "../../src/types/api.types";

test.describe("Products API", () => {
  test("returns a valid paginated product list", async ({ productsApi }) => {
    const { response, data } = await productsApi.list();

    expect(response.status()).toBe(200);
    expect(data).toMatchObject({
      page: expect.any(Number),
      size: expect.any(Number),
      total: expect.any(Number),
      totalPages: expect.any(Number),
      hasNext: expect.any(Boolean),
      items: expect.any(Array),
    });

    expect(data.items.length).toBeGreaterThan(0);
    expect(data.totalPages).toBe(Math.ceil(data.total / data.size));

    for (const product of data.items) {
      expect(product.id).toEqual(expect.any(Number));
      expect(product.name).toEqual(expect.any(String));
      expect(product.name.trim().length).toBeGreaterThan(0);
      expect(product.price).toEqual(expect.any(Number));
      expect(product.is_active).toEqual(expect.any(Boolean));
    }
  });

  test("pagination has consistent metadata and no overlap between page 1 and page 2", async ({
    productsApi,
  }) => {
    const pageSize = 20;
    const first = await productsApi.list({ page: 1, size: pageSize });
    const second = await productsApi.list({ page: 2, size: pageSize });

    expect(first.response.status()).toBe(200);
    expect(second.response.status()).toBe(200);

    const firstBody: ProductListResponse = first.data;
    const secondBody: ProductListResponse = second.data;

    expect(firstBody.page).toBe(1);
    expect(secondBody.page).toBe(2);
    expect(firstBody.size).toBe(pageSize);
    expect(secondBody.size).toBe(pageSize);

    const firstIds = new Set(firstBody.items.map((product) => product.id));
    const duplicates = secondBody.items
      .map((product) => product.id)
      .filter((id) => firstIds.has(id));

    expect(duplicates, `Duplicate IDs across pages: ${duplicates.join(", ")}`).toEqual([]);
  });

  test("retrieves a product using an ID discovered from the list API", async ({
    productsApi,
  }) => {
    const listResult = await productsApi.list({ page: 1, size: 1 });
    expect(listResult.response.status()).toBe(200);
    expect(listResult.data.items.length).toBeGreaterThan(0);

    const productFromList = listResult.data.items[0];
    const detailResult = await productsApi.getById(productFromList.id);

    expect(detailResult.response.status()).toBe(200);
    expect(detailResult.data.id).toBe(productFromList.id);
    expect(detailResult.data.name).toBe(productFromList.name);
    expect(detailResult.data.price).toBe(productFromList.price);
  });

  test("returns not found for a nonexistent product ID", async ({ productsApi }) => {
    const { response, data } = await productsApi.getById(999999999);

    expect(response.status()).toBe(404);
    expect(data).toBeDefined();
  });

  test("filters products by category", async ({ productsApi }) => {
    const { response, data } = await productsApi.list({ category: "shirts" });

    expect(response.status()).toBe(200);
    expect(data.items.length).toBeGreaterThan(0);

    for (const product of data.items) {
      expect(product.category).toBe("shirts");
    }
  });

  test("filters products by price range", async ({ productsApi }) => {
    const minPrice = 100;
    const maxPrice = 200;
    const { response, data } = await productsApi.list({ minPrice, maxPrice });

    expect(response.status()).toBe(200);

    for (const product of data.items) {
      expect(product.price).toBeGreaterThanOrEqual(minPrice);
      expect(product.price).toBeLessThanOrEqual(maxPrice);
    }
  });

  test("sorts products by price ascending", async ({ productsApi }) => {
    const { response, data } = await productsApi.list({
      sort: "price",
      order: "asc",
      size: 20,
    });

    expect(response.status()).toBe(200);
    expect(data.items.length).toBeGreaterThan(1);

    for (let index = 1; index < data.items.length; index += 1) {
      expect(data.items[index].price).toBeGreaterThanOrEqual(
        data.items[index - 1].price,
      );
    }
  });

  test("searches products by a query term", async ({ productsApi }) => {
    const { response, data } = await productsApi.list({ q: "shirt" });

    expect(response.status()).toBe(200);
    expect(data.items).toEqual(expect.any(Array));

    // Search semantics may include SKU/description/category, so don't assert
    // name-only matching until the OpenAPI/business contract confirms it.
  });

  test("rejects a search query shorter than two characters", async ({
    productsApi,
  }) => {
    const { response, data } = await productsApi.search("s");

    expect(response.status()).toBe(400);
    expect(data).toBeDefined();
  });
});
