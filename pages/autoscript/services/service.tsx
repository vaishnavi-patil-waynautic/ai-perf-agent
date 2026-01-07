import { autoScriptApi } from "@/services/api";
import { JMXRecord } from "../types/type";
import axios from "axios";
import { getUserApplication } from "./application";
import { config, getAuthHeaders } from "@/config/backendConfig";


const API_BASE = config.baseUrl;
const token = localStorage.getItem("access_token");
const headers = getAuthHeaders();


export const autoScriptService = {
  // getHistory: async (): Promise<JMXRecord[]> => {
  //   // return [];
  //   // return await autoScriptApi.getHistory();

  //   //get all the scripts by id
  //   // return all the records
  //   //else error 

  //   await login();

  //   await getUserApplication(3);


  //   const projectId = 1;
  //   const token = localStorage.getItem("access_token");

  //   console.log("Using token:", token);


  //   const res = await fetch(
  //     `http://127.0.0.1:8000/api/v1/autoscript/script/project/${projectId}`,
  //     {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   console.log("Raw Response:", res);

  //   if (!res.ok) {
  //     throw new Error("Failed to fetch autoscript history");
  //   }

  //   console.log("Response:", res);

  //   return res.json();

  // },


  getHistory: async (): Promise<JMXRecord[]> => {
    // TEMP: ensure logged in (should be done elsewhere)
    // await login();
    await getUserApplication(3);

    const projectId = 1;

    if (!token) {
      throw new Error("Missing access token");
    }

    const res = await fetch(
      `${API_BASE}/autoscript/script/project/${projectId}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch autoscript history");
    }

    const json = await res.json();

    console.log("AUTOSCRIPT RAW RESPONSE:", json);

    // ✅ THIS is the actual array
    return json.data.scripts as JMXRecord[];
  }
  ,
  generate: async (
    file1: File,
    file2: File,
    projectId: number,
    applicationId?: number
  ) => {

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const formData = new FormData();

    formData.append("har1", file1);
    formData.append("har2", file2);
    formData.append("project_id", projectId.toString());

    // append only if present
    if (applicationId !== undefined && applicationId !== null) {
      formData.append("application_id", applicationId.toString());
    }

    const response = await fetch(`${API_BASE}/autoscript/generate/`, {
      method: "POST",
      headers, // DO NOT set Content-Type for FormData
      body: formData,
    });


    console.log("Autoscript generate response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Autoscript generate failed");
    }

    const data = await response.json();


    console.log("Autoscript generate response data:", data);


    return data;
  },

  deleteJmx: async (id: number) => {
    const response = await axios.delete(
      `${API_BASE}/autoscript/script/${id}`,
      { headers: headers }
    );

    return response.data;
  },

  downloadJmx: async (id: number) => {
    const response = await axios.get(
      `${API_BASE}/autoscript/script/${id}/download/`,
      {
        headers: headers,
        responseType: "blob", // IMPORTANT for file download
      }
    );

    return response.data; // Blob
  },

  getStatus: async (id: number) => {
    // call status api by id
    // return status
    //else error message

    return "IN_PROGRESS";
  }
};
