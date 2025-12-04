import { ExternalItem } from '../../pages/NFR/types/nfrTypes';

const MOCK_ADO_ITEMS: ExternalItem[] = [
  { id: 'ADO-505', title: 'Migrate DB to Cloud', type: 'Task', source: 'ADO', tags: ['db', 'infra'] },
  { id: 'ADO-506', title: 'API Rate Limiting', type: 'Story', source: 'ADO', tags: ['security', 'backend'] },
];

export const fetchADOItems = async (): Promise<ExternalItem[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_ADO_ITEMS), 800));
};