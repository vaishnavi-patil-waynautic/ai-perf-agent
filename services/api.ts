import { User, JMXRecord } from '../types';

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
  { id: 'jmx1', fileName: 'checkout_flow.jmx', generatedAt: '2023-10-25 10:30 AM', status: 'Completed' },
  { id: 'jmx2', fileName: 'login_stress.jmx', generatedAt: '2023-10-24 02:15 PM', status: 'Completed' },
];

export const autoScriptApi = {
  generate: async (file1: File, file2: File): Promise<JMXRecord> => {
    await delay(2000); // Process time
    return {
      id: `jmx-${Date.now()}`,
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