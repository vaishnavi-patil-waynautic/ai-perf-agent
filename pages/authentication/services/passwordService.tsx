import { config } from "../../../config/backendConfig";

export const forgotPassword = async (email: string): Promise<void> => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${config.baseUrl}/users/forgot-password/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(getCsrfTokenFromCookie() && {
        "X-CSRFTOKEN": getCsrfTokenFromCookie(),
      }),
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.data?.error || data?.error || data?.data?.errors?.email || "Something went wrong");
  }
};

export const changePassword = async (
  old_password: string,
  new_password: string,
  confirm_password: string
): Promise<void> => {

  const token = localStorage.getItem("access_token");

  const res = await fetch(`${config.baseUrl}/users/change-password/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(getCsrfTokenFromCookie() && {
        "X-CSRFTOKEN": getCsrfTokenFromCookie(),
      }),
    },
    body: JSON.stringify({
      old_password,
      new_password,
      confirm_password,
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("Change password API error:", json);

    // Try to extract backend error nicely
    const backendMessage =
      json?.data?.error ||
      json?.data?.old_password?.[0] ||
      json?.data?.new_password?.[0] ||
      json?.data?.confirm_password?.[0] ||
      json?.message ||
      json?.detail ||
      (typeof json === "string" ? json : null);


    throw new Error(
      backendMessage || "Password change failed. Please try again."
    );
  }

  console.log("Password change success:", json);
};

export const resetPassword = async (token: string, new_password: string, confirm_password: string): Promise<void> => {


  const res = await fetch(`${config.baseUrl}/users/reset-password/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(getCsrfTokenFromCookie() && {
        "X-CSRFTOKEN": getCsrfTokenFromCookie(),
      }),
    },
    body: JSON.stringify({
      "token": token,
      'new_password': new_password,
      'confirm_password': confirm_password
    }),
  });
};


// CSRF helper
const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken="));

  return match ? match.split("=")[1] : null;
};
