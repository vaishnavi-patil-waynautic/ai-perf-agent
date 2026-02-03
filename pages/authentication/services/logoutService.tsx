import { config } from "../../../config/backendConfig";

export const logoutService = async (): Promise<void> => {
  const token = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  // If no token, just exit silently
  if (!token || !refresh) {
    return;
  }

  const formData = new FormData();
  formData.append("refresh", refresh);

  try {
    const res = await fetch(`${config.baseUrl}/users/logout/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...(getCsrfTokenFromCookie() && {
          "X-CSRFTOKEN": getCsrfTokenFromCookie(),
        }),
      },
      body: formData,
    });

    if (!res.ok) {
      console.warn("Backend logout failed:", res.status);
    }
  } catch (error) {
    console.warn("Logout request error:", error);
  }
};

// CSRF helper
const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken="));

  return match ? match.split("=")[1] : null;
};
