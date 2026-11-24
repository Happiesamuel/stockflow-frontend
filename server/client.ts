export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

function fallbackMessage(status: number) {
  if (status === 400 || status === 422)
    return "Please check your details and try again.";
  if (status === 401) return "Invalid email or password.";
  if (status === 403) return "You don't have access to this account.";
  if (status === 404) return "Login service not found.";
  if (status === 429)
    return "Too many attempts. Please wait a moment and try again.";
  if (status >= 500)
    return "Something went wrong on our side. Please try again later.";
  return "Something went wrong. Please try again.";
}

/** Accepts { errors: { email: "..." } } or { errors: [{ field|path, message }] } */
function toFieldErrors(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: Record<string, string> = {};
  if (Array.isArray(raw)) {
    for (const e of raw) {
      const key = e?.field ?? e?.path;
      if (key && e?.message) out[String(key)] = String(e.message);
    }
  } else {
    for (const [k, v] of Object.entries(raw)) {
      const msg = Array.isArray(v) ? v[0] : v;
      if (typeof msg === "string") out[k] = msg;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

let refreshing: Promise<boolean> | null = null;

/** One refresh at a time, even if several requests hit a 401 together. */
function refreshSession() {
  refreshing ??= fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

const LOGIN_PATH = "/auth"; // your login route

function redirectToLogin() {
  if (
    typeof window === "undefined" ||
    window.location.pathname.startsWith(LOGIN_PATH)
  )
    return;
  window.location.assign(LOGIN_PATH);
}

type ErrorBody = {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: unknown;
} | null;

/** `endpoint` can be a full URL or a path like "/businesses/me" (API_URL is added). */
export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  canRetry = true,
): Promise<T> {
  const url = /^https?:\/\//.test(endpoint)
    ? endpoint
    : `${API_URL}${endpoint}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      credentials: "include", // sends the httpOnly accessToken / refreshToken cookies
      headers: { "Content-Type": "application/json", ...options.headers },
    });
  } catch {
    throw new ApiError(
      "Can't reach the server. Check your connection and try again.",
      0,
    );
  }

  // Parse safely: error pages (HTML from a proxy, 502...) must not crash JSON.parse
  const text = await res.text();
  let data: ErrorBody = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON body */
  }

  // Not authenticated (usually an expired access token). Detected by the HTTP status
  // or, as a fallback, by the message your API sends: { success: false, message: "Not authenticated." }
  const unauthenticated =
    res.status === 401 || data?.message === "Not authenticated.";
  if (unauthenticated && !url.includes("/auth/")) {
    // 1) get a fresh access token with the refresh cookie, then repeat the request
    if (canRetry && (await refreshSession()))
      return apiFetch<T>(endpoint, options, false);
    // 2) refresh failed too: the session is over, send the user to login
    redirectToLogin();
  }

  if (!res.ok || data?.success === false) {
    throw new ApiError(
      data?.message ?? data?.error ?? fallbackMessage(res.status),
      unauthenticated ? 401 : res.status,
      toFieldErrors(data?.errors),
    );
  }
  return data as T;
}

/** True when the server says the session is missing/expired (after the silent refresh already failed). */
export function isAuthError(error: unknown) {
  if (error instanceof ApiError) return error.status === 401;
  return error instanceof Error && error.message === "Not authenticated.";
}
