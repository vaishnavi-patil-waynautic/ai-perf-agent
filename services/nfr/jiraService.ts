import { ExternalItem } from '../../pages/NFR/types/nfrTypes';

const MOCK_JIRA_ITEMS: ExternalItem[] = [
  { id: 'JIRA-101', title: 'User Login Flow Optimization', type: 'Story', source: 'Jira', tags: ['auth', 'backend'] },
  { id: 'JIRA-102', title: 'Payment Gateway Integration', type: 'Epic', source: 'Jira', tags: ['payment', 'critical'] },
  { id: 'JIRA-103', title: 'Update User Profile UI', type: 'Task', source: 'Jira', tags: ['frontend'] },
];

export const fetchJiraItems = async (filter?: string): Promise<ExternalItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!filter) resolve(MOCK_JIRA_ITEMS);
      resolve(MOCK_JIRA_ITEMS.filter(item => item.type === filter));
    }, 800);
  });
};