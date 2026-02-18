// import { autoScriptApi } from "@/services/api";
// import { JMXRecord } from "../types/type";
// import axios from "axios";
// import { getUserApplication } from "./application";
// import { config } from "@/config/backendConfig";


// const API_BASE = config.baseUrl;

// export const autoScriptService = {

//   getHistory: async (projectId: number): Promise<JMXRecord[]> => {

//     await getUserApplication(3);

//     const token = localStorage.getItem("access_token");


//     if (!token) {
//       const token = localStorage.getItem("access_token");
//       console.log("Using token:", token);
//       throw new Error("Missing access token");
//     }

//     const res = await fetch(
//       `${API_BASE}/autoscript/script/project/${projectId}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch autoscript history");
//     }

//     const json = await res.json();

//     console.log("AUTOSCRIPT RAW RESPONSE:", json);

//     return json.data.scripts as JMXRecord[];
//   },


//   generate: async (
//     file1: File,
//     file2: File,
//     projectId: number,
//     applicationId?: number | null
//   ) => {

//     const token = localStorage.getItem("access_token");

//     if (!token) {
//       throw new Error("Authentication token not found");
//     }

//     const formData = new FormData();

//     formData.append("har1", file1);
//     formData.append("har2", file2);
//     formData.append("project_id", projectId.toString());

//     // append only if present
//     if (applicationId !== undefined && applicationId !== null) {
//       formData.append("application_id", applicationId.toString());
//     }

//     const response = await fetch(`${API_BASE}/autoscript/generate/`, {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       }, // DO NOT set Content-Type for FormData
//       body: formData,
//     });


//     console.log("Autoscript generate response status:", response.status);

//     if (!response.ok) {
//       const error = await response.text();
//       throw new Error(error || "Autoscript generate failed");
//     }

//     const data = await response.json();


//     console.log("Autoscript generate response data:", data);


//     return data;
//   },

//   deleteJmx: async (id: number) => {

//     const token = localStorage.getItem("access_token");

//     const response = await axios.delete(
//       `${API_BASE}/autoscript/script/${id}`,
//       {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return response.data;
//   },

//   downloadJmx: async (id: number) => {
//     const token = localStorage.getItem("access_token");

//     const response = await axios.get(
//       `${API_BASE}/autoscript/script/${id}/download/`,
//       {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "blob",
//       }
//     );

//     return response.data; 
//   },

//   getStatus: async (id: number) => {

//     return "IN_PROGRESS";
//   },


// };



import { autoScriptApi } from "@/services/api";
import { JMXRecord } from "../types/type";
import axios from "axios";
import { getUserApplication } from "./application";
import { config } from "@/config/backendConfig";

const API_BASE = config.baseUrl;

/**
 * Simple error message extractor
 */
const getErrorMessage = (data: any, fallback: string) => {
  return data?.error || data?.message || data?.data?.error || fallback;
};

export const autoScriptService = {

  /**
   * GET HISTORY
   */
  getHistory: async (projectId: number): Promise<JMXRecord[]> => {
    try {
      await getUserApplication(3);

      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const res = await fetch(
        `${API_BASE}/autoscript/script/project/${projectId}`,
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
        throw new Error(getErrorMessage(data, "Failed to fetch autoscript history"));
      }

      return data?.data?.scripts ?? [];
    } catch (error: any) {
      console.error("getHistory error:", error);
      throw error;
    }
  },

  /**
   * GENERATE SCRIPT
   */
  generate: async (
    file1: File,
    file2: File,
    projectId: number,
    applicationId?: number | null
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication token not found");

      const formData = new FormData();
      formData.append("har1", file1);
      formData.append("har2", file2);
      formData.append("project_id", projectId.toString());

      if (applicationId !== undefined && applicationId !== null) {
        formData.append("application_id", applicationId.toString());
      }

      const response = await fetch(`${API_BASE}/autoscript/generate/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Autoscript generate failed"));
      }

      return data;
    } catch (error: any) {
      console.error("generate error:", error);
      throw error;
    }
  },

  /**
 * DELETE JMX
 */
deleteJmx: async (id: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Missing access token");

    const response = await fetch(
      `${API_BASE}/autoscript/script/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.error ||
        data?.message ||
        data?.data?.error ||
        "Delete failed"
      );
    }

    return data;
  } catch (error: any) {
    console.error("deleteJmx error:", error);
    throw error;
  }
},

/**
 * DOWNLOAD JMX
 */
downloadJmx: async (id: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Missing access token");

    const response = await fetch(
      `${API_BASE}/autoscript/script/${id}/download/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let json: any = null;

      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = text;
      }

      throw new Error(
        json?.data?.error ||
        json?.error ||
        json?.message ||
        "Download failed"
      );
    }

    // ✅ Correct for file download
    return await response.blob();

  } catch (error: any) {
    console.error("downloadJmx error:", error);
    throw error;
  }
},


  /**
   * STATUS (placeholder)
   */
  getStatus: async (id: number) => {
    try {
      return "IN_PROGRESS";
    } catch (error) {
      console.error("getStatus error:", error);
      throw error;
    }
  },
};

