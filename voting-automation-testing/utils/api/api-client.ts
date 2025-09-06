import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  private context: APIRequestContext;

  private constructor(context: APIRequestContext) {
    this.context = context;
  }

  static async init(baseURL: string): Promise<ApiClient> {
    const context = await request.newContext({
      baseURL,
      // Optionally: set headers, auth, etc.
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    return new ApiClient(context);
  }

  async get<T>(endpoint: string, token?: string) {
    const response = await this.context.get(endpoint, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
  
    if (!response.ok()) {
      throw new Error(`GET ${endpoint} failed with ${response.status()}`);
    }
  
    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: unknown) {
    const response = await this.context.post(endpoint, { data: body });
    if (!response.ok()) {
      throw new Error(`POST ${endpoint} failed with ${response.status()}`);
    }
    return response.json() as Promise<T>;
  }

  async put<T>(endpoint: string, body: unknown) {
    const response = await this.context.put(endpoint, { data: body });
    if (!response.ok()) {
      throw new Error(`PUT ${endpoint} failed with ${response.status()}`);
    }
    return response.json() as Promise<T>;
  }

  async delete<T>(endpoint: string) {
    const response = await this.context.delete(endpoint);
    if (!response.ok()) {
      throw new Error(`DELETE ${endpoint} failed with ${response.status()}`);
    }
    return response.json() as Promise<T>;
  }

  async dispose() {
    await this.context.dispose();
  }
}
