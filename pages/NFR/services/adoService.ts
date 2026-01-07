import { ExternalItem } from '../types/nfrTypes';

const MOCK_ADO_ITEMS: ExternalItem[] = [
  { id: 'ADO-505', title: 'Migrate DB to Cloud', type: 'Task', jiraUrl: 'https://ado.com/505', description: 'Migrate database to cloud infrastructure', source: 'ADO', tags: ['db', 'infra'] },
  { id: 'ADO-506', title: 'API Rate Limiting', type: 'Story', jiraUrl: 'https://ado.com/506', description: 'Implement rate limiting for API endpoints', source: 'ADO', tags: ['security', 'backend'] },
];

export const fetchADOItems = async (): Promise<ExternalItem[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ADO_ITEMS), 800));
};