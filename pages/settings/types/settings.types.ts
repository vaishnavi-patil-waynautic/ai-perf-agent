export type IntegrationType =
  | "github"
  | "blazemeter"
  | "ado"
  | "jira"
  | "datadog";

export type IntegrationStatus = "active" | "inactive" | "failed";

export interface Integration {
  id: number | null;              // null when not present → inactive
  type: IntegrationType;
  name: string;
  status: IntegrationStatus;
  token?: string | null;
  error?: string | null;
}

export interface IntegrationApiItem {
  id: number;
  integration_type: IntegrationType;
  integration_type_display: string;
  name: string;
  is_active: boolean;
  is_verified: boolean;
}

export interface IntegrationListResponse {
  status: string;
  data: {
    project_id: number;
    integrations: IntegrationApiItem[];
  };
}


export interface User {
  id: number;
  email: string;

  first_name: string;
  last_name: string;
  full_name: string;

  phone_no: string | null;
  location: string | null;
  role: string | null;
  company: string | null;
  bio: string | null;

  email_notification: boolean;

  is_active: boolean;
  is_staff: boolean;

  date_joined: string;
}


export type IntegrationDetail = {
  id: number;
  project: number;
  project_name: string;
  integration_type: string;
  integration_type_display: string;
  name: string;

  url: string | null;
  token: string;
  api_key: string | null;
  api_secret: string;
  ado_pat: string;
  application_key: string;
  username: string | null;

  is_active: boolean;
  is_verified: boolean;
  last_verified_on: string | null;
  notes: string;
};

export type IntegrationDetailResponse = {
  status: string;
  data: {
    integration: IntegrationDetail;
  };
};


