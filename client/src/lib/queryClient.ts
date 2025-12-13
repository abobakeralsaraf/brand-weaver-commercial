import { QueryClient, QueryFunction } from "@tanstack/react-query";

export class ApiError extends Error {
  status: number;
  code?: string;
  hint?: string;
  details?: unknown;

  constructor(params: { message: string; status: number; code?: string; hint?: string; details?: unknown }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.code = params.code;
    this.hint = params.hint;
    this.details = params.details;
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await res.json().catch(() => null);
      const message =
        (body && typeof body === "object" && "error" in body && typeof (body as any).error === "string"
          ? (body as any).error
          : res.statusText) || res.statusText;
      throw new ApiError({
        status: res.status,
        message,
        code: body && typeof body === "object" ? (body as any).code : undefined,
        hint: body && typeof body === "object" ? (body as any).hint : undefined,
        details: body,
      });
    }

    const text = (await res.text()) || res.statusText;
    throw new ApiError({ status: res.status, message: text });
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

function parseSseEventBlock(block: string): { event: string; data: string } | null {
  const lines = block.split("\n");
  let event = "message";
  let data = "";
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice("event:".length).trim();
    if (line.startsWith("data:")) data += line.slice("data:".length).trim();
  }
  if (!data) return null;
  return { event, data };
}

export async function sseRequest<TResult>(params: {
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
  onProgress?: (progress: any) => void;
}): Promise<TResult> {
  const res = await fetch(params.url, {
    method: params.method ?? "POST",
    headers: params.body ? { "Content-Type": "application/json" } : {},
    body: params.body ? JSON.stringify(params.body) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);

  if (!res.body) {
    throw new ApiError({ status: 500, message: "Server did not provide a streaming response." });
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const parsed = parseSseEventBlock(raw);
      if (!parsed) continue;

      if (parsed.event === "progress") {
        try {
          params.onProgress?.(JSON.parse(parsed.data));
        } catch {
          // ignore malformed progress frames
        }
        continue;
      }

      if (parsed.event === "error") {
        let errObj: any = null;
        try {
          errObj = JSON.parse(parsed.data);
        } catch {
          errObj = { error: parsed.data };
        }
        const message = errObj?.error || "Request failed";
        throw new ApiError({
          status: errObj?.status || 500,
          message,
          code: errObj?.code,
          hint: errObj?.hint,
          details: errObj,
        });
      }

      if (parsed.event === "result") {
        const result = JSON.parse(parsed.data);
        return result as TResult;
      }
    }
  }

  throw new ApiError({ status: 500, message: "Stream ended without a result." });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
