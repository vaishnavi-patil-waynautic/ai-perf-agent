// import axios from "axios";
// import { config } from "@/config/backendConfig";

// const API_BASE = config.baseUrl;

// // Common headers


// export const nfrService = {
//   /**
//    * Get all NFR documents
//    */
//   getAll: async () => {
//     try {

//       const token = localStorage.getItem("access_token");

// const headers = {
//   Accept: "application/json",
//   Authorization: `Bearer ${token}`,
// };

//       console.log(" Get all called---------------------");
//       if (!token) throw new Error("Missing access token");

//       const res = await fetch(
//         `${API_BASE}/autonfr/nfr-documents/`,
//         {
//           method: "GET",
//           headers,
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch NFR documents");
//       }

//       const json = await res.json();

//       console.log("NFR getAll response:", json);
      
//       return json.data.nfr_documents;
//     } catch (err) {
//       console.error("NFR getAll error:", err);
//       throw err;
//     }
//   },


//   getNfrListByProjectId: async (projectId: number) => {
//     try {

//       const token = localStorage.getItem("access_token");

// const headers = {
//   Accept: "application/json",
//   Authorization: `Bearer ${token}`,
// };

//       if (!token) throw new Error("Missing access token");


//       console.log("Fetching NFR by project id in Service")

//       const res = await fetch(
//         `${API_BASE}/autonfr/nfr-documents/?project_id=${projectId}`, 
//         {
//           method: "GET",
//           headers,
//         }
//       );

//       console.log("NFR get by project id response:", res);

//       if (!res.ok) {
//         throw new Error("Failed to fetch NFR document");
//       }

//       const json = await res.json();

//       console.log("NFR get by project id response:", json);
      
//       return json.data.nfr_documents;
//     } catch (err) {
//       console.error("NFR get error:", err);
//       throw err;
//     }
//   },

//   /**
//    * Delete NFR document by id
//    */
//   deleteById: async (nfrId: number) => {
//     try {

//       const token = localStorage.getItem("access_token");

// const headers = {
//   Accept: "application/json",
//   Authorization: `Bearer ${token}`,
// };

//       if (!token) throw new Error("Missing access token");

//       const res = await fetch(
//         `${API_BASE}/autonfr/nfr-documents/${nfrId}/`,
//         {
//           method: "DELETE",
//           headers,
//         }
//       );

//       console.log("NFR delete response:", await res.json());


//       if (!res.ok) {
//         throw new Error("Failed to delete NFR document");
//       }

      
//       return await res;
//     } catch (err) {
//       console.error("NFR delete error:", err);
//       throw err;
//     }
//   },

//   /**
//    * Download NFR document by id
//    */
//   downloadById: async (nfrId: number): Promise<Blob> => {
//     try {

//       const token = localStorage.getItem("access_token");

// const headers = {
//   Accept: "application/json",
//   Authorization: `Bearer ${token}`,
// };

//       if (!token) throw new Error("Missing access token");

//       const response = await axios.get(
//         `${API_BASE}/autonfr/nfr-documents/${nfrId}/download/`,
//         {
//           headers,
//           responseType: "blob",
//         }
//       );

//       return response.data;
//     } catch (err) {
//       console.error("NFR download error:", err);
//       throw err;
//     }
//   },

//   /**
//    * Show / fetch NFR report by id
//    */
//   getReportById: async (nfrId: number) => {
//     try {

//       const token = localStorage.getItem("access_token");

// const headers = {
//   Accept: "application/json",
//   Authorization: `Bearer ${token}`,
// };

//       if (!token) throw new Error("Missing access token");

//       const res = await fetch(
//         `${API_BASE}/autonfr/nfr-documents/${nfrId}/`,
//         {
//           method: "GET",
//           headers,
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch NFR report");
//       }

//       const json = await res.json();

//       console.log("NFR report response:", json.data.nfr_document);
//       return json.data.nfr_document;

//     } catch (err) {
//       console.error("NFR report error:", err);
//       throw err;
//     }
//   },

//   /**
//    * Generate NFR
//    */
// //   generate: async ({
// //   Record<string, any>
// // }: {
// //   Record<string, any>// ✅ multiple files
// // }) => {
// //   try {

// //     const token = localStorage.getItem("access_token");

// // const headers = {
// //   Accept: "application/json",
// //   Authorization: `Bearer ${token}`,
// // };

// //     if (!token) throw new Error("Missing access token");


// //     console.log("Generating NFR with payload:", {
// //       projectId,
// //       applicationId, additionalInput, env, sla, wlm, files
// //     });

// //     const formData = new FormData();
// //     formData.append("projectId", projectId.toString());
// //     formData.append("applicationId", applicationId.toString());
// //     formData.append("env", env);
// //     formData.append("sla", sla);
// //     formData.append("wlm", wlm);

// //     if (additionalInput) {
// //       formData.append("additional_input", additionalInput);
// //     }

// //     // ✅ append multiple files
// //     files.forEach((file) => {
// //       formData.append("docs", file);
// //     });

// //     const res = await fetch(
// //       `${API_BASE}/autonfr/generate-nfr/`,
// //       {
// //         method: "POST",
// //         headers, // ❗ do NOT set Content-Type
// //         body: formData,
// //       }
// //     );

// //     if (!res.ok) {
// //       const error = await res.text();
// //       throw new Error(error || "NFR generation failed");
// //     }


// //     console.log("NFR generate response received", res);

// //     const json = await res.json();
// //     return json;
// //   } catch (err) {
// //     console.error("NFR generate error:", err);
// //     throw err;
// //   }
// // },

// generate: async (payload: Record<string, any>) => {
//   try {
//     const token = localStorage.getItem("access_token");
//     if (!token) throw new Error("Missing access token");

//     const headers = {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     };

//     console.log("Generating NFR with payload:", payload);

//     const formData = new FormData();

//     // 🔥 Dynamically append everything
//     Object.entries(payload).forEach(([key, value]) => {
//       if (value === undefined || value === null) return;

//       // Multiple files
//       if (Array.isArray(value) && value.length && value[0] instanceof File) {
//         value.forEach((file) => formData.append(key, file));
//       }
//       // Object → stringify
//       else if (typeof value === "object") {
//         formData.append(key, JSON.stringify(value));
//       }
//       // Primitive
//       else {
//         formData.append(key, String(value));
//       }
//     });

//     const res = await fetch(`${API_BASE}/autonfr/generate-nfr/`, {
//       method: "POST",
//       headers, // ❗ DO NOT set Content-Type manually
//       body: formData,
//     });

//     const text = await res.text();
//     let json: any = null;

//     try {
//       json = text ? JSON.parse(text) : null;
//     } catch {
//       json = text;
//     }

//     if (!res.ok) {
//       console.error("NFR generate failed:", json);
//       throw new Error(
//         json?.data?.error ||
//         json?.message ||
//         json?.detail ||
//         "NFR generation failed"
//       );
//     }

//     console.log("NFR generate success:", json);
//     return json;

//   } catch (err) {
//     console.error("NFR generate error:", err);
//     throw err;
//   }
// },


//   async fetchAdoItems(ProjectId: number): Promise<any[]> {
//     const token = localStorage.getItem("access_token");
//     if (!token) throw new Error("Missing token");

//       const res = await fetch(`${config.baseUrl}/autonfr/fetchadoitems/`, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       project_id: ProjectId,
//     }),
//   });

//     if (!res.ok) {
//       const txt = await res.text();
//       throw new Error(txt || "Failed to fetch ADO items");
//     }

//     const json = await res.json();
//     return json?.data?.simplified_data ?? [];
//   },

// };



import axios from "axios";
import { config } from "@/config/backendConfig";

const API_BASE = config.baseUrl;

/** Simple error extractor */
const getErrorMessage = (data: any, fallback: string) => {
  return data?.error || data?.message || data?.data?.error || data?.detail || fallback;
};

export const nfrService = {

  /* ================= GET ALL ================= */
  getAll: async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(`${API_BASE}/autonfr/nfr-documents/`, {
        method: "GET",
        headers,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch NFR documents"));
      }

      return data?.data?.nfr_documents ?? [];
    } catch (err) {
      console.error("NFR getAll error:", err);
      throw err;
    }
  },

  /* ================= GET BY PROJECT ================= */
  getNfrListByProjectId: async (projectId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(
        `${API_BASE}/autonfr/nfr-documents/?project_id=${projectId}`,
        { method: "GET", headers }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch NFR documents"));
      }

      return data?.data?.nfr_documents ?? [];
    } catch (err) {
      console.error("NFR getByProject error:", err);
      throw err;
    }
  },

  /* ================= DELETE ================= */
  deleteById: async (nfrId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(
        `${API_BASE}/autonfr/nfr-documents/${nfrId}/`,
        { method: "DELETE", headers }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to delete NFR document"));
      }

      return data;
    } catch (err) {
      console.error("NFR delete error:", err);
      throw err;
    }
  },

  /* ================= DOWNLOAD ================= */
  downloadById: async (nfrId: number): Promise<Blob> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${API_BASE}/autonfr/nfr-documents/${nfrId}/download/`,
        {
          headers,
          responseType: "blob",
        }
      );

      return response.data;
    } catch (err: any) {
      console.error("NFR download error:", err);
      throw new Error(
        getErrorMessage(err?.response?.data, "Failed to download NFR")
      );
    }
  },

  /* ================= GET REPORT ================= */
  getReportById: async (nfrId: number) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(
        `${API_BASE}/autonfr/nfr-documents/${nfrId}/`,
        { method: "GET", headers }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch NFR report"));
      }

      return data?.data?.nfr_document;
    } catch (err) {
      console.error("NFR report error:", err);
      throw err;
    }
  },

  /* ================= GENERATE ================= */
  generate: async (payload: Record<string, any>) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value) && value.length && value[0] instanceof File) {
          value.forEach((file) => formData.append(key, file));
        } else if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await fetch(`${API_BASE}/autonfr/generate-nfr/`, {
        method: "POST",
        headers,
        body: formData,
      });

      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "NFR generation failed"));
      }

      return data;
    } catch (err) {
      console.error("NFR generate error:", err);
      throw err;
    }
  },

  /* ================= FETCH ADO ================= */
  fetchAdoItems: async (ProjectId: number): Promise<any[]> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const res = await fetch(`${API_BASE}/autonfr/fetchadoitems/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ project_id: ProjectId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch ADO items"));
      }

      return data?.data?.simplified_data ?? [];
    } catch (err) {
      console.error("fetchAdoItems error:", err);
      throw err;
    }
  },
};
