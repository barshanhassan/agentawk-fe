import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// When VITE_API_BASE_URL is set (e.g. production), calls go directly to that
// absolute backend URL. When it's empty (local dev), API_BASE_URL stays "" so
// requests use relative /api/... paths and the Vite dev proxy forwards them to
// the backend — same-origin, so no CORS/preflight ("Failed to fetch") issues.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | FormData | undefined,
): Promise<Response> {
  const isFormData = data instanceof FormData;
  const token = localStorage.getItem("auth_token");

  const headers: Record<string, string> = {};
  if (!isFormData && data) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // With an absolute backend base, strip the /api prefix (NestJS serves at root).
  // With an empty base (dev proxy mode), keep /api so Vite's proxy matches it.
  let processedUrl = url;
  if (API_BASE_URL && processedUrl.startsWith("/api")) {
    processedUrl = processedUrl.substring(4);
  }
  const fullUrl = `${API_BASE_URL}${processedUrl.startsWith("/") ? "" : "/"}${processedUrl}`;

  console.log("Requesting:", fullUrl);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: isFormData ? (data as FormData) : (data ? JSON.stringify(data) : undefined),
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let path = queryKey.join("/");
    if (API_BASE_URL && path.startsWith("/api")) {
      path = path.substring(4);
    }

    const fullUrl = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

    const res = await fetch(fullUrl, {
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
