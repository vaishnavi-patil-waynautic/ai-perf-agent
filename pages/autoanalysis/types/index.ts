export interface Application {
  id: number;
  name: string;
  config_status: string | null;
  latest_build: number;
}


export interface JmxScriptOption {
  id: string;
  name: string;
}

export type ConfigMessage = {
  field: string;
  type: "warning" | "failure";
  message: string;
  severity: "low" | "medium" | "high";
};

export interface AppConfiguration {
  id: number;
  project_id: number;
  application_id: number;
  application_name: string;

  script_id: number | null;

  blazemeter_url: string | null;
  gha_repo_url: string | null;
  gha_workflow: string | null;     // ✅ NEW
  ado_url: string | null;
  datadog_url: string | null;
  nfrLink: string | null;

  recipient_list: string;
  run_schedule: "manual" | "automated";

  status?: string;                 // partially_configured etc

  created_on: string;
  updated_on: string;
}

export interface BuildResult {
  build_number: string;
  test_timing: string;
  result_id: string;
}

export interface AppDetails {
  config: AppConfiguration;
  builds: BuildResult[];
  total_builds: number;

  warnings?: ConfigMessage[] | null;   // ✅ NEW
  failures?: ConfigMessage[] | null;   // ✅ NEW
}


// export interface AppConfiguration {
//   id: number;
//   project_id: number;
//   application_id: number;
//   script_id: number;
//   application_name: string;

//   blazemeter_url: string | null;
//   gha_repo_url: string | null;
//   ado_url: string | null;
//   datadog_url: string | null;
//   nfrLink: string | null;

//   recipient_list: string; // comma separated emails
//   run_schedule: 'manual' | 'automated';

//   created_on: string;
//   updated_on: string;
// }
// export interface BuildResult {
//   build_number: string;
//   test_timing: string;
//   result_id: string;
// }
// export interface AppDetails {
//   config: AppConfiguration;
//   builds: BuildResult[];
//   total_builds: number;
// }


export interface ResultMetric {
  id: number;
  transaction_name: string;
  total_hits: number;
  tps: number;
  avg_rt: number;
  rt_90th: number;
  rt_95th: number;
  max_rt: number;
  error_rate: number;
  created_on: string;
}

export interface BuildReport {
  id: number;
  project_id: number;
  application_id: number;
  result_id: string;
  build_number: string;
  test_timing: string;
  observations: string;
  datadog_remarks: string;
  ado_defects: string;
  result_data: ResultMetric[];
  created_on: string;
  updated_on: string;
}

export interface BuildReportResponse {
  status: string;
  data: BuildReport;
}

