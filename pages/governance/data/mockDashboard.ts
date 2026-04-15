import { WidgetConfig } from '../types/widget';

// ── Mock widget configs ────────────────────────────────────────────────────
export const mockWidgets: WidgetConfig[] = [
  {
    id: 'kpi-1',
    type: 'KPI',
    title: 'Avg Response Time',
    dataSource: { url: '/metrics/response-time', method: 'GET' },
    layout: { x: 0, y: 0, w: 3, h: 2 },
    visuals: { color: '#1976d2' },
  },
  {
    id: 'kpi-2',
    type: 'KPI',
    title: 'Error Rate',
    dataSource: { url: '/metrics/error-rate', method: 'GET' },
    layout: { x: 3, y: 0, w: 3, h: 2 },
    visuals: { color: '#ef5350' },
  },
  {
    id: 'kpi-3',
    type: 'KPI',
    title: 'Throughput (TPS)',
    dataSource: { url: '/metrics/throughput', method: 'GET' },
    layout: { x: 6, y: 0, w: 3, h: 2 },
    visuals: { color: '#4caf50' },
  },
  {
    id: 'kpi-4',
    type: 'KPI',
    title: 'NFR Compliance',
    dataSource: { url: '/metrics/compliance', method: 'GET' },
    layout: { x: 9, y: 0, w: 3, h: 2 },
    visuals: { color: '#ff9800' },
  },
  {
    id: 'line-1',
    type: 'CHART_LINE',
    title: 'Response Time Trend (7 days)',
    dataSource: { url: '/metrics/response-trend', method: 'GET' },
    layout: { x: 0, y: 2, w: 8, h: 3 },
    visuals: { showLegend: true },
  },
  {
    id: 'table-1',
    type: 'TABLE',
    title: 'Recent JMX Scripts',
    dataSource: { url: '/scripts/recent', method: 'GET' },
    layout: { x: 8, y: 2, w: 4, h: 3 },
    visuals: {},
  },
];

// ── Mock data per widget id ────────────────────────────────────────────────
export const mockWidgetData: Record<string, any> = {
  'kpi-1': { value: '342 ms', trend: -8 },
  'kpi-2': { value: '0.4%', trend: -2 },
  'kpi-3': { value: '1,240', trend: 12 },
  'kpi-4': { value: '94%', trend: 3 },
  'line-1': [
    { name: 'Mon', value: 380 },
    { name: 'Tue', value: 420 },
    { name: 'Wed', value: 310 },
    { name: 'Thu', value: 290 },
    { name: 'Fri', value: 342 },
    { name: 'Sat', value: 260 },
    { name: 'Sun', value: 300 },
  ],
  'table-1': [
    { id: '1', name: 'checkout_flow_v3.jmx', status: 'success', timestamp: '2026-04-14 09:12' },
    { id: '2', name: 'login_stress_v2.jmx', status: 'success', timestamp: '2026-04-13 15:44' },
    { id: '3', name: 'api_load_test.jmx', status: 'failed', timestamp: '2026-04-13 11:20' },
    { id: '4', name: 'catalog_browse.jmx', status: 'success', timestamp: '2026-04-12 08:55' },
    { id: '5', name: 'payment_gateway.jmx', status: 'success', timestamp: '2026-04-11 17:30' },
  ],
};
