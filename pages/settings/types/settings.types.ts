export type Application = {
  id: string;
  name: string;
  description: string;
};

export type IntegrationType =
  | "datadog"
  | "ado"
  | "jira"
  | "github"
  | "blazemeter";

export type Integration = {
  type: IntegrationType;
  name: string;
  connected: boolean;
  token?: string;
};
