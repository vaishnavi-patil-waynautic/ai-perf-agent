import axios from "axios";
import { config } from "@/config/backendConfig";

const API_BASE = config.baseUrl;

// Common headers
const token = localStorage.getItem("access_token");

const headers = {
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
};

export const nfrService = {
  /**
   * Get all NFR documents
   */
  getAll: async () => {
    try {

      console.log(" Get all called---------------------");
      if (!token) throw new Error("Missing access token");

      const res = await fetch(
        `${API_BASE}/autonfr/nfr-documents/`,
        {
          method: "GET",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch NFR documents");
      }

      const json = await res.json();

      console.log("NFR getAll response:", json);
      
      return json.data.nfr_documents;
    } catch (err) {
      console.error("NFR getAll error:", err);
      throw err;
    }
  },

  /**
   * Delete NFR document by id
   */
  deleteById: async (nfrId: number) => {
    try {
      if (!token) throw new Error("Missing access token");

      const res = await fetch(
        `${API_BASE}/autonfr/nfr-documents/${nfrId}/`,
        {
          method: "DELETE",
          headers,
        }
      );

      console.log("NFR delete response:", await res.json());


      if (!res.ok) {
        throw new Error("Failed to delete NFR document");
      }

      
      return await res;
    } catch (err) {
      console.error("NFR delete error:", err);
      throw err;
    }
  },

  /**
   * Download NFR document by id
   */
  downloadById: async (nfrId: number): Promise<Blob> => {
    try {
      if (!token) throw new Error("Missing access token");

      const response = await axios.get(
        `${API_BASE}/autonfr/nfr-documents/${nfrId}/download/`,
        {
          headers,
          responseType: "blob",
        }
      );

      return response.data;
    } catch (err) {
      console.error("NFR download error:", err);
      throw err;
    }
  },

  /**
   * Show / fetch NFR report by id
   */
  getReportById: async (nfrId: number) => {
    try {
      if (!token) throw new Error("Missing access token");

      const res = await fetch(
        `${API_BASE}/autonfr/nfr-documents/${nfrId}/`,
        {
          method: "GET",
          headers,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch NFR report");
      }

      const json = await res.json();

      console.log("NFR report response:", json.data.nfr_document);
      return json.data.nfr_document;

    } catch (err) {
      console.error("NFR report error:", err);
      throw err;
    }
  },

  /**
   * Generate NFR
   */
  generate: async ({
  projectId,
  applicationId,
  additionalInput,
  env,
  sla,
  wlm,
  files,
}: {
  projectId: number;
  applicationId: number;
  additionalInput?: string;
  env: string;
  sla: string;
  wlm: string;
  files: File[]; // ✅ multiple files
}) => {
  try {
    if (!token) throw new Error("Missing access token");


    console.log("Generating NFR with payload:", {
      projectId,
      applicationId, additionalInput, env, sla, wlm, files
    });

    const formData = new FormData();
    formData.append("projectId", projectId.toString());
    formData.append("applicationId", applicationId.toString());
    formData.append("env", env);
    formData.append("sla", sla);
    formData.append("wlm", wlm);

    if (additionalInput) {
      formData.append("additional_input", additionalInput);
    }

    // ✅ append multiple files
    files.forEach((file) => {
      formData.append("docs", file);
    });

    const res = await fetch(
      `${API_BASE}/autonfr/generate-nfr/`,
      {
        method: "POST",
        headers, // ❗ do NOT set Content-Type
        body: formData,
      }
    );

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || "NFR generation failed");
    }


    console.log("NFR generate response received", res);

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("NFR generate error:", err);
    throw err;
  }
},

};
