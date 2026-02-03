import { NFRStrategy } from "../types/nfrTypes";

export const generateStrategy = async (data: any): Promise<Partial<NFRStrategy>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 10000),
        createdOn: new Date().toISOString().split('T')[0],
        status: 'In Process',
        resultContent: "This is a dummy Performance Test Strategy generated based on your inputs. \n\n1. Load Testing: 5000 concurrent users.\n2. Stress Testing: 150% load.\n3. Latency targets: <200ms API response.",
        appName: "Global Payment App" // Mocked derived name
      });
    }, 1500);
  });
};