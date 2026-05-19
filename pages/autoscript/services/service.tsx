import { autoScriptApi } from "@/services/api";
import { JMXRecord } from "../types/type";
import axios from "axios";
import { getUserApplication } from "./application";
import { config } from "@/config/backendConfig";

const API_BASE = config.baseUrl;

const getErrorMessage = (data: any, fallback: string) => {
  return data?.error || data?.message || data?.data?.error || fallback;
};

interface GenerateScriptResponse {
  success: boolean;
  message: string;
  data?: {
    script_id?: number;  // Backend should return this
    scriptId?: number;   // Alternative field name
    id?: number;         // Alternative field name
  };
  script_id?: number;    // Top-level alternative
  scriptId?: number;     // Top-level alternative
}

interface GetHistoryOptions {
  signal?: AbortSignal;
}

// ============================================================================
// SERVICE
// ============================================================================

export const autoScriptService = {

  /**
   * GET HISTORY
   * 
   * ✨ NEW: Supports AbortSignal for request cancellation
   */
  getHistory: async (
    projectId: number, 
    options?: GetHistoryOptions
  ): Promise<JMXRecord[]> => {
    try {
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
          signal: options?.signal,  // ✨ Pass abort signal
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(getErrorMessage(data, "Failed to fetch autoscript history"));
      }

      return data?.data?.scripts ?? [];
    } catch (error: any) {
      // Don't log abort errors - they're intentional
      if (error?.name !== 'AbortError') {
        console.error("getHistory error:", error);
      }
      throw error;
    }
  },

  /**
   * GET SCRIPT STATUS BY ID
   * 
   * ✨ NEW: Get status of a specific script
   * Endpoint: GET /autoscript/script/{script_id}/status/
   */
  getScriptStatus: async (scriptId: number): Promise<JMXRecord> => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Missing access token");

      const res = await fetch(
        `${API_BASE}/autoscript/script/${scriptId}/status/`,
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
        throw new Error(getErrorMessage(data, "Failed to fetch script status"));
      }

      // Assuming backend returns the script object directly or nested in data
      return data?.data ?? data;
    } catch (error: any) {
      console.error("getScriptStatus error:", error);
      throw error;
    }
  },

  /**
   * GENERATE SCRIPT
   * 
   * ✨ CRITICAL: Backend MUST return the newly created script ID
   * 
   * Expected response format:
   * {
   *   success: true,
   *   message: "Script generation started",
   *   data: { script_id: 123 }
   * }
   * 
   * OR:
   * {
   *   success: true,
   *   message: "...",
   *   script_id: 123
   * }
   */
  generate: async (
    file1: File,
    file2: File,
    projectId: number,
    applicationId?: number | null
  ): Promise<GenerateScriptResponse> => {
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

      return await response.blob();

    } catch (error: any) {
      console.error("downloadJmx error:", error);
      throw error;
    }
  },
};

// ============================================================================
// HELPER: Extract script ID from generate response
// ============================================================================

/**
 * Extract script ID from various possible response formats
 * Handles different backend response structures
 */
export const extractScriptId = (response: GenerateScriptResponse): number | null => {
  // Try data.script_id
  if (response?.data?.script_id) {
    return response.data.script_id;
  }
  
  // Try data.scriptId
  if (response?.data?.scriptId) {
    return response.data.scriptId;
  }
  
  // Try data.id
  if (response?.data?.id) {
    return response.data.id;
  }
  
  // Try top-level script_id
  if (response?.script_id) {
    return response.script_id;
  }
  
  // Try top-level scriptId
  if (response?.scriptId) {
    return response.scriptId;
  }
  
  console.warn('[extractScriptId] Could not find script ID in response:', response);
  return null;
};