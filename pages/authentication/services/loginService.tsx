import { config } from "../../../config/backendConfig";

interface LoginResponse {
  user: any;
  access: string;
  refresh: string;
}

export const login = async (
  email: string,
  password: string
): Promise<{ user: any; access: string }> => {

  const res = await fetch(`${config.baseUrl}/users/login/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(getCsrfTokenFromCookie() && {
        "X-CSRFTOKEN": getCsrfTokenFromCookie(),
      }),
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Login failed");
  }

  const data = await res.json();

  // backend returns: { data: { access, refresh, user } }
  const { access, refresh, user }: LoginResponse = data.data;

  if (!access || !refresh || !user) {
    throw new Error("Invalid login response");
  }

  // Persist auth data
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  // IMPORTANT: return BOTH user + token
  return { user, access };
};

// CSRF helper
const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken="));

  return match ? match.split("=")[1] : null;
};
