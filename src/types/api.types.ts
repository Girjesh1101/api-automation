export interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  correlationId?: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  is_active: boolean;
  category?: string;
  brand?: string;
  total_stock?: number;
  variant_count?: number;
}

export interface ProductListResponse {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  items: Product[];
}

export interface ProductQuery {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
  includeInactive?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Token fields are optional here because API implementations may use different
 * naming conventions. Confirm the actual field in your OpenAPI/login response.
 */
export interface AuthResponse {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: {
    id?: number | string;
    email?: string;
    name?: string;
  };
  [key: string]: unknown;
}
