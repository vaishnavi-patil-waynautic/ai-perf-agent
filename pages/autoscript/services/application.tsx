// export async function getUserApplication(appId: number) {
//   const token = localStorage.getItem("access_token");

//   console.log("TOKEN SENT:", token); // must NOT be null

//   const res = await fetch(
//     `http://127.0.0.1:8000/api/v1/users/application/${appId}`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch application");
//   }

//   const json = await res.json();
//   console.log("APPLICATION RESPONSE:", json);

//   return json;
// }



export async function getUserApplication(appId: number) {
  try {
    const token = localStorage.getItem("access_token");

    console.log("TOKEN SENT:", token);

    if (!token) {
      throw new Error("Missing access token");
    }

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
