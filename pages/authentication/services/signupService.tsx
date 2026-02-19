import { config } from "../../../config/backendConfig";

// export const signup = async (
//   email: string,
//   firstName : string,
//   lastName : string,
//   password: string
// ): Promise<{ user: any; access: string }> => {

//   const res = await fetch(`${config.baseUrl}/users/signup/`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       ...(getCsrfTokenFromCookie() && {
//         "X-CSRFTOKEN": getCsrfTokenFromCookie(),
//       }),
//     },
//     body: JSON.stringify({
//       email,
//       firstName,
//       lastName,
//       password,
//     }),
//   });

//       const data = await res.json().catch(() => null);

//      if (!res.ok) {
//       // Throw FULL error object (important)
//       throw {
//         status: data?.status || "error",
//         message:
//           data?.message ||
//           data?.data?.error ||
//           "Signup failed",
//         errors: data?.errors || data?.data?.errors || null,
//         raw: data,
//       };
//     }

//   getUserInfo();

//   const data = await res.json();

//   return ;
// };


export const signup = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string
): Promise<{ user: any; access: string }> => {
  try {
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

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // Throw FULL error object (important)
      throw {
        status: data?.status || "error",
        message:
          data?.message ||
          data?.data?.error ||
          "Signup failed",
        errors: data?.errors || data?.data?.errors || null,
        raw: data,
      };
    }

    getUserInfo();

    return data;
  } catch (error) {
    // Network / unexpected error
    if (error instanceof TypeError) {
      throw {
        message: "Network error. Please check your connection.",
      };
    }

    throw error;
  }
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
