export interface ExternalItem {
  id: string;
  title: string;
  type: string;              // <-- allow any (Issue, Bug, Task, Story…)
  url: string;               // <-- renamed from jiraUrl
  description: string;
  source: 'ADO';             // Jira disabled for now
  tags: string[];
}


export interface WizardState {
  selectedItemIds: string[];
  uploadedFiles: File[];
  questionnaireResponses: {
    questionId: string;
    answer: string;
  }[];
  additionalInstructions: string;
  selectedApplicationId: string | null;

  externalItems: ExternalItem[];     // <-- ADD
  loadingItems: boolean;             // <-- ADD
}

