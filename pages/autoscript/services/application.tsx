import { config } from "@/config/backendConfig";

export async function getUserApplication(appId: number) {
  try {
    const token = localStorage.getItem("access_token");

    console.log("TOKEN SENT:", token);

    if (!token) {
      throw new Error("Missing access token");
    }

    const res = await fetch(
      `${config.baseUrl}/users/application/${appId}/`,  // Added trailing slash
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.data?.error ||
        "Failed to fetch application";

      throw new Error(message);
    }

    console.log("APPLICATION RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("getUserApplication error:", error);
    throw error;
  }
}
