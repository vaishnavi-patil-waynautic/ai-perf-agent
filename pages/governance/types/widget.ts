// export interface WidgetConfig {
//   id: string;           // UUID
//   type: 'KPI' | 'CHART_LINE' | 'CHART_BAR' | 'TABLE' | 'ROI';
//   title: string;
//   dataSource: {
//     url: string;        // The Django API endpoint
//     method: 'GET' | 'POST';
//     params?: Record<string, any>;
//   };
//   layout: {
//     x: number;          // Column position (0-11)
//     y: number;          // Row position
//     w: number;          // Width in grid units
//     h: number;          // Height in grid units
//     minW?: number;
//   };
//   visuals: {
//     color?: string;     // Custom blue shade
//     showLegend?: boolean;
//     refreshInterval?: number; // ms
//   };
// }


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