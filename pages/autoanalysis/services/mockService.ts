import { Application, AppConfiguration, BuildResult, JmxScriptOption, AppDetails, BuildReport, BuildReportResponse } from '../types';
import { config } from "@/config/backendConfig";


const API_BASE = config.baseUrl;
const token = localStorage.getItem("access_token");
const headers = config.headers;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock Data ---
// let applications: Application[] = [
//   { id: '1', name: 'E-Com Checkout Service', status: 'configured', lastReportName: 'Build #452', lastRunDate: '2023-10-25' },
//   { id: '2', name: 'User Auth Module', status: 'unconfigured', lastReportName: null, lastRunDate: null },
//   { id: '3', name: 'Inventory API', status: 'configured', lastReportName: 'Build #112', lastRunDate: '2023-10-24' },
// ];

// let currentConfig: AppConfiguration = {
//   id: '1',
//   integrations: { github: true, blazemeter: true, cicd: true, loadGenerator: true, ado: false, datadog: true },
//   executionStrategy: 'automated',
//   emailRecipients: ['devops@company.com', 'lead@company.com'],
//   nfrLink: '/ai-perf-agent/#/autoanalysis/STRAT-1234',
//   builds: [
//     { id: 'b1', name: 'Build #452', date: '2023-10-25 14:30', status: 'pass' },
//     { id: 'b2', name: 'Build #451', date: '2023-10-24 09:15', status: 'fail' },
//     { id: 'b3', name: 'Build #450', date: '2023-10-23 11:00', status: 'warning' },
//   ],
// };

// --- API Methods ---

export const fetchApplications = async (projectId: number): Promise<Application[]> => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(
    `${API_BASE}/autoanalysis/projects/${projectId}/applications/`,
    {
      method: "GET",
      headers: headers,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }

  const json = await res.json();

  console.log("Autoanalysis RAW RESPONSE:", json);

  return json.data.applications;
};


export const fetchJmxOptions = async (): Promise<JmxScriptOption[]> => {
  await delay(500);
  return [
    { id: 'jmx1', name: 'checkout_flow_v2.jmx' },
    { id: 'jmx2', name: 'login_stress_test.jmx' },
    { id: 'jmx3', name: 'search_load.jmx' },
  ];
};

// export const createApplication = async (data: any): Promise<Application> => {
//   await delay(2000); // Simulate processing
//   const newApp = {};
//   return newApp;
// };

// export const deleteApplication = async (id: string): Promise<void> => {
//   await delay(600);
//   applications = applications.filter((app) => app.id !== id);
// };

// export const saveSettings = async (settings: GlobalSettings): Promise<void> => {
//   await delay(1000);
//   console.log('Settings saved:', settings);
// };

export const fetchAppDetails = async (
  projectId: number,
  appId: number
): Promise<AppDetails> => {

  const res = await fetch(
    `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/`,
    {
      headers: {
        Accept: "application/json",
    Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await res.json();

  console.log("RAW RESPONSE:", json);

  // IMPORTANT: unwrap "data"
  return json.data;
};


export const updateEmailRecipients = async (
  projectId: number,
  appId: number,
  emails: string[]
): Promise<void> => {

  const token = localStorage.getItem("access_token");

  console.log(" Update Recepient Payload : ", emails);

  const res = await fetch(
    `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/recipients/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        recipient_list: emails.join(","),
      }),
    }
  );

  console.log(" Update Recepient : ", res);

  const json = await res.json();

  if (!res.ok) {
    // 🔥 throw FULL backend error
    const error: any = new Error("Recipient update failed");
    error.data = json?.data;
    throw error;
  }

  return json;
};


export const fetchBuildReport = async (
  projectId: string,
  appId: string,
  buildId: string
): Promise<BuildReport> => {

  const res = await fetch(
    `${API_BASE}/autoanalysis/projects/${projectId}/applications/${appId}/builds/${buildId}/`,
    {
      headers: headers
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch report");
  }

  const json: BuildReportResponse = await res.json();

  return json.data; // IMPORTAN
};
