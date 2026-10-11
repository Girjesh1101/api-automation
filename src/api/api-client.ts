import type {
  APIRequestContext,
  APIResponse,
} from "@playwright/test";

export interface ApiResult<T> {
  response: APIResponse;
  data: T;
}

export interface ApiRequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export class ApiClient {
  constructor(private readonly context: APIRequestContext) {}

  async get<T>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResult<T>> {
    try {
      const response = await this.context.get(path, {
        params: options?.params,
        headers: options?.headers,
      });
      return { response, data: await this.parseBody<T>(response) };
    } catch (error: unknown) {
      throw this.toRequestError("GET", path, error);
    }
  }

  async post<T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<ApiResult<T>> {
    try {
      const response = await this.context.post(path, {
        data: body,
        headers,
      });
      return { response, data: await this.parseBody<T>(response) };
    } catch (error: unknown) {
      throw this.toRequestError("POST", path, error);
    }
  }

  async patch<T>(
    path: string,
    body?: unknown,
    headers?: Record<string, string>,
  ): Promise<ApiResult<T>> {
    try {
      const response = await this.context.patch(path, {
        data: body,
        headers,
      });
      return { response, data: await this.parseBody<T>(response) };
    } catch (error: unknown) {
      throw this.toRequestError("PATCH", path, error);
    }
  }

  async delete<T = unknown>(
    path: string,
    headers?: Record<string, string>,
  ): Promise<ApiResult<T>> {
    try {
      const response = await this.context.delete(path, { headers });
      return { response, data: await this.parseBody<T>(response) };
    } catch (error: unknown) {
      throw this.toRequestError("DELETE", path, error);
    }
  }

  private async parseBody<T>(response: APIResponse): Promise<T> {
    const text = await response.text();

    if (!text.trim()) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      // Preserve non-JSON error bodies for diagnostics.
      return text as T;
    }
  }

  private toRequestError(
    method: string,
    path: string,
    error: unknown,
  ): Error {
    const message =
      error instanceof Error ? error.message : "Unknown network/request error";

    return new Error(`${method} ${path} failed before a response was received: ${message}`);
  }
}
