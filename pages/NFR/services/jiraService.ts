import { ExternalItem } from '../types/nfrTypes';

const MOCK_JIRA_ITEMS: ExternalItem[] = [
  { id: 'JIRA-101', title: 'User Login Flow Optimization', type: 'Story', description: 'Optimize the user login flow for better performance.Optimize the user login flow for better performance.Optimize the user login flow for better performance.Optimize the user login flow for better performance.Optimize the user login flow for better performance.', jiraUrl: 'https://jira.example.com/browse/JIRA-101', source: 'Jira', tags: ['auth', 'backend'] },
  { id: 'JIRA-102', title: 'Payment Gateway Integration', type: 'Epic', description: 'Optimize the user login flow for better performance.', jiraUrl: 'https://jira.example.com/browse/JIRA-101', source: 'Jira', tags: ['payment', 'critical'] },
  { id: 'JIRA-103', title: 'Update User Profile UI', type: 'Task', description: '', jiraUrl: 'https://jira.example.com/browse/JIRA-103', source: 'Jira', tags: ['frontend'] },
];

export const fetchJiraItems = async (filter?: string): Promise<ExternalItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!filter) resolve(MOCK_JIRA_ITEMS);
      resolve(MOCK_JIRA_ITEMS.filter(item => item.type === filter));
    }, 800);
  });
};