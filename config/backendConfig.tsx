export const config = {
  baseUrl: "http://127.0.0.1:8000/api/v1",
  username: "m@gmail.com",
  password: "Himanshu@12",

  
};



export const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Authentication token not found");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};
