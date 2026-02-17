import { config } from "../../../config/backendConfig";

export const signup = async (
  email: string,
  firstName : string,
  lastName : string,
  password: string
): Promise<{ user: any; access: string }> => {

  const res = await fetch(`${config.baseUrl}/users/signup/`, {
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
      firstName,
      lastName,
      password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error(errorData)
    throw new Error(errorData?.message || errorData?.data?.error || "Login failed");
  }

  getUserInfo();

  const data = await res.json();

  return ;
};

const getUserInfo = () =>{
  
}

// CSRF helper
const getCsrfTokenFromCookie = (): string | null => {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken="));

  return match ? match.split("=")[1] : null;
};
