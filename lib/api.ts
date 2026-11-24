const API_URL = process.env.NEXT_PUBLIC_API_URL!;

let refreshing: Promise<boolean> | null = null;

function refreshSession() {
  // share one refresh call between simultaneous 401s
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

export async function api(path: string, init: RequestInit = {}) {
  const send = () =>
    fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include", // sends the httpOnly cookies
      headers: { "Content-Type": "application/json", ...init.headers },
    });

  let res = await send();

  if (res.status === 401 && !path.startsWith("/auth/")) {
    if (await refreshSession()) res = await send(); // retry once
  }
  return res;
}
