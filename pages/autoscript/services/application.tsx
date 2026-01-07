export async function getUserApplication(appId: number) {
  const token = localStorage.getItem("access_token");

  console.log("TOKEN SENT:", token); // must NOT be null

  const res = await fetch(
    `http://127.0.0.1:8000/api/v1/users/application/${appId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch application");
  }

  const json = await res.json();
  console.log("APPLICATION RESPONSE:", json);

  return json;
}
