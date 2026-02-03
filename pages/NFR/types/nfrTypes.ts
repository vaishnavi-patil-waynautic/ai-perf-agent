export interface ExternalItem {
  id: string;
  title: string;
  type: 'Story' | 'Task' | 'Epic';
  jiraUrl: string;
  description: string;
  source: 'Jira' | 'ADO';
  tags: string[];
}


export interface WizardState {
  // Step 1: Jira / ADO
  selectedItemIds: string[];

  // Step 2: Documents
  uploadedFiles: File[];

  // Step 3: Questionnaire (dynamic)
  questionnaireResponses: {
    questionId: string;
    answer: string;
  }[];

  // Step 4: Final inputs
  additionalInstructions: string;
  selectedApplicationId: string | null;
}
