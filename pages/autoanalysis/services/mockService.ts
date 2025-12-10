import { Application, AppConfiguration, BuildResult, JmxScriptOption, GlobalSettings } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock Data ---
let applications: Application[] = [
  { id: '1', name: 'E-Com Checkout Service', status: 'configured', lastReportName: 'Build #452', lastRunDate: '2023-10-25' },
  { id: '2', name: 'User Auth Module', status: 'unconfigured', lastReportName: null, lastRunDate: null },
  { id: '3', name: 'Inventory API', status: 'configured', lastReportName: 'Build #112', lastRunDate: '2023-10-24' },
];

let currentConfig: AppConfiguration = {
  id: '1',
  integrations: { github: true, blazemeter: true, cicd: true, loadGenerator: true, ado: false, datadog: true },
  executionStrategy: 'automated',
  emailRecipients: ['devops@company.com', 'lead@company.com'],
  builds: [
    { id: 'b1', name: 'Build #452', date: '2023-10-25 14:30', status: 'pass' },
    { id: 'b2', name: 'Build #451', date: '2023-10-24 09:15', status: 'fail' },
    { id: 'b3', name: 'Build #450', date: '2023-10-23 11:00', status: 'warning' },
  ],
};

// --- API Methods ---

export const fetchApplications = async (): Promise<Application[]> => {
  await delay(800);
  return [...applications];
};

export const fetchJmxOptions = async (): Promise<JmxScriptOption[]> => {
  await delay(500);
  return [
    { id: 'jmx1', name: 'checkout_flow_v2.jmx' },
    { id: 'jmx2', name: 'login_stress_test.jmx' },
    { id: 'jmx3', name: 'search_load.jmx' },
  ];
};

export const createApplication = async (data: any): Promise<Application> => {
  await delay(2000); // Simulate processing
  const newApp: Application = {
    id: Math.random().toString(36).substr(2, 9),
    name: data.appName,
    status: 'configured',
    lastReportName: null,
    lastRunDate: new Date().toISOString().split('T')[0],
  };
  applications.push(newApp);
  return newApp;
};

export const deleteApplication = async (id: string): Promise<void> => {
  await delay(600);
  applications = applications.filter((app) => app.id !== id);
};

export const saveSettings = async (settings: GlobalSettings): Promise<void> => {
  await delay(1000);
  console.log('Settings saved:', settings);
};

export const fetchAppDetails = async (id: string): Promise<AppConfiguration> => {
  await delay(800);
  // In a real app, find by ID. Here we return the mock config.
  return { ...currentConfig, id };
};

export const updateEmailRecipients = async (emails: string[]): Promise<void> => {
  await delay(500);
  currentConfig.emailRecipients = emails;
};

export const fetchBuildReport = async (buildId: string): Promise<string> => {
  await delay(1200);
  return `
# Performance Report: ${buildId}

## Summary
The performance test **PASSED** with a throughput of 500 req/sec.

### Metrics
| Metric | Value |
| :--- | :--- |
| **Response Time (Avg)** | 120ms |
| **Error Rate** | 0.01% |
| **90th Percentile** | 200ms |

### Analysis
The system stabilized after 2 minutes of ramp-up. The database connection pool remained healthy.

![Chart](https://via.placeholder.com/600x200/1976d2/ffffff?text=Throughput+Graph+Mock)
  `;
};