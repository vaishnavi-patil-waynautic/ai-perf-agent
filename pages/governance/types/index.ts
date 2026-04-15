export type WidgetType = 'KPI' | 'LINE_CHART' | 'BAR_CHART' | 'PIE_CHART' | 'TABLE';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  endpoint: string; // Django API endpoint for data
  gridSettings: { x: number; y: number; w: number; h: number };
  props?: any;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: WidgetConfig[];
}

export interface GlobalFilters {
  projectId: string;
  dateRange: [Date | null, Date | null];
  environment: string;
}