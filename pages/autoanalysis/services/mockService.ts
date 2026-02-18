// import { Application, AppConfiguration, BuildResult, JmxScriptOption, AppDetails, BuildReport, BuildReportResponse } from '../types';
// import { config } from "@/config/backendConfig";


// const API_BASE = config.baseUrl;
// const token = localStorage.getItem("access_token");
// const headers = config.headers;

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// // --- Mock Data ---
// // let applications: Application[] = [
// //   { id: '1', name: 'E-Com Checkout Service', status: 'configured', lastReportName: 'Build #452', lastRunDate: '2023-10-25' },
// //   { id: '2', name: 'User Auth Module', status: 'unconfigured', lastReportName: null, lastRunDate: null },
// //   { id: '3', name: 'Inventory API', status: 'configured', lastReportName: 'Build #112', lastRunDate: '2023-10-24' },
// // ];

// // let currentConfig: AppConfiguration = {
// //   id: '1',
// //   integrations: { github: true, blazemeter: true, cicd: true, loadGenerator: true, ado: false, datadog: true },
// //   executionStrategy: 'automated',
// //   emailRecipients: ['devops@company.com', 'lead@company.com'],
// //   nfrLink: '/ai-perf-agent/#/autoanalysis/STRAT-1234',
// //   builds: [
// //     { id: 'b1', name: 'Build #452', date: '2023-10-25 14:30', status: 'pass' },
// //     { id: 'b2', name: 'Build #451', date: '2023-10-24 09:15', status: 'fail' },
// //     { id: 'b3', name: 'Build #450', date: '2023-10-23 11:00', status: 'warning' },
// //   ],
// // };

// // --- API Methods ---

// export const downloadScript = async (projectId: number, appId: number): Promise<Blob> => {
//   const token = localStorage.getItem("access_token");
//   if (!token) throw new Error("Missing access token");

//   const res = await fetch(
//     `${config.baseUrl}/autoanalysis/projects/${projectId}/applications/${appId}/download-script/`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(text || "Failed to download script");
//   }

//   return await res.blob();
// };

// export const fetchApplications = async (projectId: number): Promise<Application[]> => {
//   const token = localStorage.getItem("access_token");

//   const res = await fetch(
//     `${API_BASE}/autoanalysis/projects/${projectId}/applications/`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch applications");
//   }

//   const json = await res.json();

//   console.log("Autoanalysis RAW RESPONSE:", json);

//   return json.data.applications;
// };


// export const fetchJmxOptions = async (): Promise<JmxScriptOption[]> => {
//   await delay(500);
//   return [
//     { id: 'jmx1', name: 'checkout_flow_v2.jmx' },
//     { id: 'jmx2', name: 'login_stress_test.jmx' },
//     { id: 'jmx3', name: 'search_load.jmx' },
//   ];
// };

// // export const createApplication = async (data: any): Promise<Application> => {
// //   await delay(2000); // Simulate processing
// //   const newApp = {};
// //   return newApp;
// // };

// // export const deleteApplication = async (id: string): Promise<void> => {
// //   await delay(600);
// //   applications = applications.filter((app) => app.id !== id);
// // };

// // export const saveSettings = async (settings: GlobalSettings): Promise<void> => {
// //   await delay(1000);
// //   console.log('Settings saved:', settings);
// // };

// export const fetchAppDetails = async (
//   projectId: number,
//   appId: number
// ): Promise<AppDetails> => {

//   const token = localStorage.getItem("access_token");

//   const res = await fetch(
//     `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/`,
//     {
//       headers: {
//         Accept: "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   const json = await res.json();

//   console.log("RAW RESPONSE:", json);

//   // IMPORTANT: unwrap "data"
//   return json.data;
// };



// export const getScriptsByAppId =
//   async (ApplicationId: number): Promise<[]> => {


//     const token = localStorage.getItem("access_token");


//     if (!token) {
//       const token = localStorage.getItem("access_token");
//       console.log("Using token:", token);
//       throw new Error("Missing access token");
//     }

//     const res = await fetch(
//       `${API_BASE}/autoscript/script/application/${ApplicationId}`,
//       {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch Script by application id");
//     }

//     const json = await res.json();

//     console.log("AUTOSCRIPT RAW RESPONSE:", json);

//     // ✅ THIS is the actual array
//     return json.data.scripts;
//   }

// export const updateEmailRecipients = async (
//   projectId: number,
//   appId: number,
//   emails: string[]
// ): Promise<void> => {

//   const token = localStorage.getItem("access_token");

//   console.log(" Update Recepient Payload : ", emails);

//   const res = await fetch(
//     `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/recipients/`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         recipient_list: emails.join(","),
//       }),
//     }
//   );

//   console.log(" Update Recepient : ", res);

//   const json = await res.json();

//   if (!res.ok) {
//     // 🔥 throw FULL backend error
//     const error: any = new Error("Recipient update failed");
//     error.data = json?.data;
//     throw error;
//   }

//   return json;
// };


// export const getApplicationStatus = async (
//   projectId: number,
//   applicationId: number
// ) => {
//   const token = localStorage.getItem("access_token");

//   const res = await fetch(
//     `${API_BASE}/autoanalysis/projects/${projectId}/applications/${applicationId}/setup-progress/`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!res.ok) throw new Error("Failed to fetch status");

//   return res.json();
// };


// export const configureApplication = async (
//   projectId: number,
//   applicationId: number,
//   formData: FormData
// ) => {
//     const token = localStorage.getItem("access_token");
    
//   const res = await fetch(
//     `${API_BASE}/autoanalysis/projects/${projectId}/applications/${applicationId}/setup/`,
//     {
//       method: 'POST',

//       // ❌ DO NOT SET Content-Type FOR FORMDATA
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },

//       body: formData,
//     }
//   );

//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || 'Configure application failed');
//   }

//   return res.json();
// };




// export const fetchBuildReport = async (
//   projectId: string,
//   appId: string,
//   buildId: string
// ): Promise<BuildReport> => {

//   const token = localStorage.getItem("access_token");

//   const res = await fetch(
//     `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/builds/${buildId}/`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       }
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch report");
//   }

//   const json: BuildReportResponse = await res.json();

//   return json.data; // IMPORTAN
// };



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
