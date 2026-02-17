import { autoScriptApi } from "@/services/api";
import { JMXRecord } from "../types/type";
import axios from "axios";
import { getUserApplication } from "./application";
import { config } from "@/config/backendConfig";


const API_BASE = config.baseUrl;
const headers = config.headers;

const getheaders = () => {

    const token = localStorage.getItem("access_token");

    if (!token) {
      const token = localStorage.getItem("access_token");
      console.log("Using token:", token);
      throw new Error("Missing access token");
    }



}


export const autoScriptService = {

  getHistory: async (projectId: number): Promise<JMXRecord[]> => {

    await getUserApplication(3);

    const token = localStorage.getItem("access_token");


    if (!token) {
      const token = localStorage.getItem("access_token");
      console.log("Using token:", token);
      throw new Error("Missing access token");
    }

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

    if (!res.ok) {
      throw new Error("Failed to fetch autoscript history");
    }

    const json = await res.json();

    console.log("AUTOSCRIPT RAW RESPONSE:", json);

    // ✅ THIS is the actual array
    return json.data.scripts as JMXRecord[];
  },


  generate: async (
    file1: File,
    file2: File,
    projectId: number,
    applicationId?: number | null
  ) => {

    const token = localStorage.getItem("access_token");

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
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }, // DO NOT set Content-Type for FormData
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

    const token = localStorage.getItem("access_token");

    const response = await axios.delete(
      `${API_BASE}/autoscript/script/${id}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  downloadJmx: async (id: number) => {
    const token = localStorage.getItem("access_token");

    const response = await axios.get(
      `${API_BASE}/autoscript/script/${id}/download/`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    return response.data; 
  },

  getStatus: async (id: number) => {

    return "IN_PROGRESS";
  },


};
