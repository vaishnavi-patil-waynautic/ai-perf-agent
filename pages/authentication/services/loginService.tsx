import { config } from '../../../config/backendConfig';  

export const login = async (email: string, password: string) => {
  const res = await fetch(
    `${config.baseUrl}/users/login/`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // CSRF is usually NOT required for JWT login,
        // but since your curl uses it, keep it for now
        "X-CSRFTOKEN": getCsrfTokenFromCookie(),
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();

  const { access, refresh, user } = data.data;

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};



const getCsrfTokenFromCookie = () => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith("csrftoken="))
    ?.split("=")[1];
};

