import type { ApiClient, ApiResult } from "./api-client";
import type {
  Product,
  ProductListResponse,
  ProductQuery,
} from "../types/api.types";

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  list(query: ProductQuery = {}): Promise<ApiResult<ProductListResponse>> {
    const params = Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined),
    ) as Record<string, string | number | boolean>;

    return this.client.get<ProductListResponse>("/products", { params });
  }

  getById(id: number | string): Promise<ApiResult<Product>> {
    return this.client.get<Product>(`/products/${encodeURIComponent(String(id))}`);
  }

  getVariants(id: number | string): Promise<ApiResult<unknown>> {
    return this.client.get<unknown>(
      `/products/${encodeURIComponent(String(id))}/variants`,
    );
  }

  categories(): Promise<ApiResult<unknown>> {
    return this.client.get<unknown>("/categories");
  }

  categoryProducts(id: number | string): Promise<ApiResult<unknown>> {
    return this.client.get<unknown>(
      `/categories/${encodeURIComponent(String(id))}/products`,
    );
  }

  brands(): Promise<ApiResult<unknown>> {
    return this.client.get<unknown>("/brands");
  }

  search(query: string): Promise<ApiResult<unknown>> {
    return this.client.get<unknown>("/search", {
      params: { q: query },
    });
  }
}
