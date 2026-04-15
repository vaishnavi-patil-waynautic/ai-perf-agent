import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useTaskStatus = (taskId: string | null) => {
  return useQuery({
    queryKey: ['task-status', taskId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tasks/${taskId}/status/`);
      return data;
    },
    enabled: !!taskId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      return data?.status === 'SUCCESS' || data?.status === 'FAILURE' ? false : 3000;
    },
  });
};