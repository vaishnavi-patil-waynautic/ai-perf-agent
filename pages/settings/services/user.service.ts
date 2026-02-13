import { config } from "../../../config/backendConfig";
import { User } from "../types/settings.types";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Missing token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const userService = {

  // GET /users/me/
  async getMe(): Promise<User> {
    console.log("[API] GET /users/me");

    const res = await fetch(`${config.baseUrl}/users/me/`, {
      headers: getHeaders(),
    });

    const json = await res.json();
    console.log("[API] /users/me response:", json);

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    return json.data;
  },

  // PUT /users/me/
  async updateMe(payload: Partial<User>): Promise<User> {
    console.log("[API] PUT /users/me payload:", payload);

    const res = await fetch(`${config.baseUrl}/users/me/`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    console.log("[API] /users/me update response:", json);

    if (!res.ok) {
      throw new Error(
        json?.data?.error?.detail ||
        "Failed to update profile"
      );
    }

    return json.data;
  },
};
