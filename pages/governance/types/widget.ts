export interface WidgetConfig {
  id: string;
  type: 'KPI' | 'CHART_LINE' | 'CHART_BAR' | 'TABLE' | 'ROI';
  title: string;

  dataSource?: {
    url: string;
    method: 'GET' | 'POST';
    params?: Record<string, any>;
  };

  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
  };

  visuals?: {
    color?: string;
    showLegend?: boolean;
    refreshInterval?: number;
  };
}