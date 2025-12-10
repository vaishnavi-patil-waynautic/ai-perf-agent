export interface Application {
  id: string;
  name: string;
  status: 'configured' | 'unconfigured';
  lastReportName: string | null;
  lastRunDate: string | null;
}

export interface JmxScriptOption {
  id: string;
  name: string;
}

export interface AppConfiguration {
  id: string;
  integrations: {
    github: boolean;
    blazemeter: boolean;
    cicd: boolean;
    loadGenerator: boolean;
    ado: boolean;
    datadog: boolean;
  };
  executionStrategy: 'automated' | 'manual';
  emailRecipients: string[];
  builds: BuildResult[];
}

export interface BuildResult {
  id: string;
  name: string;
  date: string;
  status: 'pass' | 'fail' | 'warning';
}

export interface GlobalSettings {
  blazemeterToken: string;
  cicdTool: string;
  cicdToken: string;
  apmTool: string;
  apmToken: string;
}