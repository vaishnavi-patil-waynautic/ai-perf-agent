import { User, JMXRecord } from '../store/types';

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(1000);
    if (email && password) {
      return {
        user: { id: 'u1', name: 'Perf Engineer', email, avatar: 'https://picsum.photos/200' },
        token: 'mock-jwt-token-12345',
      };
    }
    throw new Error('Invalid credentials');
  },
  signup: async (email: string): Promise<boolean> => {
    await delay(1000);
    return true;
  },
  forgotPassword: async (email: string): Promise<boolean> => {
    await delay(800);
    return true;
  },
};

const MOCK_JMX_DATA: JMXRecord[] = [
  { id: 1, fileName: 'checkout_flow.jmx', generatedAt: '2023-10-25 10:30 AM', status: 'Completed' },
  { id: 2, fileName: 'login_stress.jmx', generatedAt: '2023-10-24 02:15 PM', status: 'Completed' },
];

export const autoScriptApi = {
  generate: async (file1: File, file2: File): Promise<JMXRecord> => {
    await delay(2000); // Process time
    MOCK_JMX_DATA.push({
      id: MOCK_JMX_DATA.length + 1,
      fileName: `generated_script_${Date.now()}.jmx`,
      generatedAt: new Date().toLocaleString(),
      status: 'Completed',
    });
    return {
      id: 3,
      fileName: `generated_script_${Date.now()}.jmx`,
      generatedAt: new Date().toLocaleString(),
      status: 'Completed',
    };
  },
  getHistory: async (): Promise<JMXRecord[]> => {
    await delay(500);
    return [...MOCK_JMX_DATA];
  },
  deleteJmx: async (id: string): Promise<void> => {
    await delay(300);
  }
};