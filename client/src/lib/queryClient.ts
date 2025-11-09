import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  path: string,
  body?: any
): Promise<Response> {
  // Get Telegram WebApp initData for authentication
  let initData = '';
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    initData = (window as any).Telegram.WebApp.initData;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Send initData in Authorization header
  if (initData) {
    headers['Authorization'] = `tma ${initData}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(path, options);
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const headers: Record<string, string> = {};

    const tg = (window as any).Telegram?.WebApp;
    const telegramId = tg?.initDataUnsafe?.user?.id?.toString() || 'johndoe';
    if (telegramId) {
      headers['x-telegram-id'] = telegramId;
    }

    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers,
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