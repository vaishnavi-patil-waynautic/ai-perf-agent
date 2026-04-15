import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/client';

export const useDashboardSync = (dashboardId: string) => {
  const mutation = useMutation({
    mutationFn: (newLayout: any) => 
      apiClient.patch(`/dashboards/${dashboardId}/layout/`, { layout: newLayout }),
    onSuccess: () => {
      // Show subtle toast notification
    }
  });

  const handleLayoutChange = (currentLayout: any) => {
    // We only sync if we aren't in "preview" mode
    mutation.mutate(currentLayout);
  };

  return { syncLayout: handleLayoutChange, isSaving: mutation.isPending };
};