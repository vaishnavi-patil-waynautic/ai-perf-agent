import { get } from "http";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  // if (!token) throw new Error("Authentication token not found");

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  
};

export const config = {
  // baseUrl: "http://98.89.42.100:8000/api/v1",
  baseUrl: "http://localhost:8000/api/v1",
  username: "m@gmail.com",
  password: "Himanshu@12",
  headers: getAuthHeaders(),
  
};



