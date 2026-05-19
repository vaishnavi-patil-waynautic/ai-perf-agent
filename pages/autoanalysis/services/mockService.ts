import {
  Application,
  AppConfiguration,
  BuildResult,
  JmxScriptOption,
  AppDetails,
  BuildReport,
  BuildReportResponse
} from '../types';
import { config } from "@/config/backendConfig";

const API_BASE = config.baseUrl;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simple error extractor */
const getErrorMessage = (data: any, fallback: string) => {
  return data?.error || data?.message || data?.data?.error || fallback;
};

/* ================= DOWNLOAD SCRIPT ================= */
export const downloadScript = async (
  projectId: number,
  appId: number
): Promise<Blob> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Missing access token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/download-script/`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to download script");
    }

    return await res.blob();
  } catch (err) {
    console.error("downloadScript error:", err);
    throw err;
  }
};

/* ================= FETCH APPLICATIONS ================= */
export const fetchApplications = async (
  projectId: number
): Promise<Application[]> => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Failed to fetch applications"));
    }

    return data?.data?.applications ?? [];
  } catch (err) {
    console.error("fetchApplications error:", err);
    throw err;
  }
};

/* ================= MOCK JMX OPTIONS ================= */
export const fetchJmxOptions = async (): Promise<JmxScriptOption[]> => {
  await delay(500);
  return [
    { id: 'jmx1', name: 'checkout_flow_v2.jmx' },
    { id: 'jmx2', name: 'login_stress_test.jmx' },
    { id: 'jmx3', name: 'search_load.jmx' },
  ];
};

/* ================= FETCH APP DETAILS ================= */
export const fetchAppDetails = async (
  projectId: number,
  appId: number
): Promise<AppDetails> => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Failed to fetch application details"));
    }

    return data?.data;
  } catch (err) {
    console.error("fetchAppDetails error:", err);
    throw err;
  }
};

/* ================= GET SCRIPTS BY APP ================= */
export const getScriptsByAppId = async (ApplicationId: number): Promise<any[]> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Missing access token");

    const res = await fetch(
      `${API_BASE}/autoscript/script/application/${ApplicationId}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Failed to fetch scripts"));
    }

    return data?.data?.scripts ?? [];
  } catch (err) {
    console.error("getScriptsByAppId error:", err);
    throw err;
  }
};

/* ================= SYNC SECRETS TO GITHUB ================= */
export const syncSecretsToGitHub = async (
  projectId: number,
  appId: number,
  repoUrl: string,                           // ← REQUIRED: GitHub repo URL
  extraSecrets?: Record<string, string>
): Promise<{
  success: boolean;
  pushed: string[];
  failed: string[];
  total: number;
  message: string;
}> => {
  try {
    const token = localStorage.getItem("access_token");

    // .git suffix strip karo — backend raw GitHub URL expect karta hai
    const cleanRepoUrl = repoUrl.replace(/\.git$/, '').trim();

    const body: Record<string, any> = {
      repo_url: cleanRepoUrl,                // ← backend ko clean repo_url bhejo
    };
    if (extraSecrets) {
      body.extra_secrets = extraSecrets;
    }

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/gha/sync-secrets/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Failed to sync secrets to GitHub"));
    }

    return data?.data;
  } catch (err) {
    console.error("syncSecretsToGitHub error:", err);
    throw err;
  }
};

/* ================= UPDATE EMAIL RECIPIENTS ================= */
export const updateEmailRecipients = async (
  projectId: number,
  appId: number,
  emails: string[]
): Promise<any> => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/recipients/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient_list: emails.join(","),
        }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Recipient update failed"));
    }

    return data;
  } catch (err) {
    console.error("updateEmailRecipients error:", err);
    throw err;
  }
};

/* ================= APPLICATION STATUS ================= */
export const getApplicationStatus = async (
  projectId: number,
  applicationId: number
) => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${applicationId}/setup-progress/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Failed to fetch status"));
    }

    return data;
  } catch (err) {
    console.error("getApplicationStatus error:", err);
    throw err;
  }
};

/* ================= CONFIGURE APPLICATION ================= */
export const configureApplication = async (
  projectId: number,
  applicationId: number,
  formData: FormData
) => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${applicationId}/setup/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set content-type
        },
        body: formData,
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Configure application failed"));
    }

    return data;
  } catch (err) {
    console.error("configureApplication error:", err);
    throw err;
  }
};

/* ================= FETCH BUILD REPORT ================= */
export const fetchBuildReport = async (
  projectId: string,
  appId: string,
  buildId: string
): Promise<BuildReport> => {
  try {
    const token = localStorage.getItem("access_token");

    const res = await fetch(
      `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/builds/${buildId}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data: BuildReportResponse | null = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(getErrorMessage(data, "Failed to fetch report"));
    }

    return data?.data as BuildReport;
  } catch (err) {
    console.error("fetchBuildReport error:", err);
    throw err;
  }
};
