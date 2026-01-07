export interface ExternalItem {
  id: string;
  title: string;
  type: 'Story' | 'Task' | 'Epic';
  jiraUrl: string;
  description: string;
  source: 'Jira' | 'ADO';
  tags: string[];
}

export interface NFRStrategy {
  id: string;
  appName: string;
  createdOn: string;
  status: 'In Process' | 'Completed' | 'Failed';
  createdBy: string;
  resultContent?: string;
}

export interface WizardState {
  selectedItems: ExternalItem[];
  uploadedFiles: string[]; // Storing file names for mock
  questionnaire: {
    targetUsers: string;
    peakLoad: string;
    environment: string;
  };
  additionalInstructions: string;
  applicationName: string;
}