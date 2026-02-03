export interface Application {
  id: number;
  name: string;
  config_status: string | null;
  total_builds: number;
}


export interface JmxScriptOption {
  id: string;
  name: string;
}

export interface AppConfiguration {
  id: number;
  project_id: number;
  application_id: number;
  script_id: number;

  blazemeter_url: string | null;
  gha_repo_url: string | null;
  ado_url: string | null;
  datadog_url: string | null;
  nfrLink: string | null;

  recipient_list: string; // comma separated emails
  run_schedule: 'manual' | 'automated';

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
}
