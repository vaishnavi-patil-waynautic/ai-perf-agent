import { Token } from '@mui/icons-material';
import { config } from '../../../config/backendConfig';

export const logout = async () => {

    const token = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    if (!token) throw new Error("Authentication token not found");

    const formData = new FormData();

    formData.append("refresh", refresh);

    const res = await fetch(
        `${config.baseUrl}/users/logout/`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "X-CSRFTOKEN": getCsrfTokenFromCookie(),
            },
            body: formData,
        }
    );

    if (!res.ok) {
        console.error("Logout failed with status:", res);
        throw new Error("Logout failed");
    }

    console.log("Logout successful");

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    return;
};



const getCsrfTokenFromCookie = () => {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("csrftoken="))
        ?.split("=")[1];
};

