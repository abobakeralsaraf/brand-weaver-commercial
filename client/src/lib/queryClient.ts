import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD && globalThis.location?.hostname?.endsWith("netlify.app")
    ? "/.netlify/functions"
    : "/api");

async function throwIfResNotok(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

type ApiRequestOptions = {
  method: string;
  url: string;
  data?: unknown;
};

function buildApiUrl(url: string): string {
  // Already absolute URL
  if (/^https?:\/\//i.test(url)) return url;

  const base = API_URL.replace(/\/+$/, "");
  const baseIsAbsolute = /^https?:\/\//i.test(base);

  // When API_URL is absolute, preserve the same origin by resolving via URL().
  if (url.startsWith("/")) {
    if (baseIsAbsolute) return new URL(url, base).toString();
    return `${base}${url}`;
  }

  return `${base}/${url}`;
}

export async function apiRequest(method: string, url: string, data?: unknown): Promise<Response>;
export async function apiRequest(options: ApiRequestOptions): Promise<Response>;
export async function apiRequest(
  methodOrOptions: string | ApiRequestOptions,
  urlMaybe?: string,
  dataMaybe?: unknown,
): Promise<Response> {
  const { method, url, data } =
    typeof methodOrOptions === "string"
      ? { method: methodOrOptions, url: urlMaybe ?? "", data: dataMaybe }
      : methodOrOptions;

  const res = await fetch(buildApiUrl(url), {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotok(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401 }: { on401: UnauthorizedBehavior }) =>
  async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    const path = (queryKey as Array<string | number>).join("/");
    const res = await fetch(`${API_URL}/${path}`, {
      credentials: "include",
    });

    if (res.status === 401 && on401 === "returnNull") {
      return null as unknown as T;
    }

    await throwIfResNotok(res);

    if (res.status === 204) {
      return null as unknown as T;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    return (await res.text()) as unknown as T;
  };

export const queryClient = new QueryClient();
