const API_URL = import.meta.env.VITE_API_URL || '/api';

import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotok(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  { method, url, data }: { method: string; url: string; data?: unknown | undefined },
): Promise<Response> {
  const res = await fetch(`${API_URL}/${url}`, {
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
  ({ on401 }: UnauthorizedBehavior) =>
  async (({ queryKey }: { queryKey: unknown[] }) => {
    const res = await fetch(`${API_URL}/${(queryKey as string[]).join("/")}`, {
      credentials: "include",
    });

    await throwIfResNotok(res);
    return res;
  });

export const queryClient = new QueryClient();
