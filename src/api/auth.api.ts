import { expect } from "@playwright/test";
import type { ApiClient, ApiResult } from "./api-client";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/api.types";

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  register(payload: RegisterRequest): Promise<ApiResult<AuthResponse>> {
    return this.client.post<AuthResponse>("/auth/register", payload);
  }

  login(payload: LoginRequest): Promise<ApiResult<AuthResponse>> {
    return this.client.post<AuthResponse>("/auth/login", payload);
  }

  me(accessToken: string): Promise<ApiResult<unknown>> {
    return this.client.get<unknown>("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  logout(accessToken: string): Promise<ApiResult<unknown>> {
    return this.client.post<unknown>("/auth/logout", undefined, {
      Authorization: `Bearer ${accessToken}`,
    });
  }

  refresh(refreshToken: string): Promise<ApiResult<AuthResponse>> {
    return this.client.post<AuthResponse>(
      "/auth/refresh",
      { refreshToken },
      { Authorization: `Bearer ${refreshToken}` },
    );
  }

  /**
   * Runtime validation is important: TypeScript interfaces do not validate
   * JSON received over the network.
   */
  getAccessToken(payload: AuthResponse): string {
    const token = payload.accessToken ?? payload.access_token ?? payload.token;

    expect(
      token,
      "Login response should contain accessToken, access_token, or token",
    ).toEqual(expect.any(String));

    return token as string;
  }
}
