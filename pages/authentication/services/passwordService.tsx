import { config } from "../../../config/backendConfig";

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


// CSRF helper
const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken="));

  return match ? match.split("=")[1] : null;
};
