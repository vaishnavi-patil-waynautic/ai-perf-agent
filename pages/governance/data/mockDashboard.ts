import { WidgetConfig } from '../types/widget';

/* -------------------------------------------------------------------------- */
/*                         Default Configurations                             */
/* -------------------------------------------------------------------------- */

const defaultDataSource = {
  url: '/mock-api',
  method: 'GET' as const,
};

const defaultVisuals = {
  showLegend: true,
  refreshInterval: 0,
};

/* -------------------------------------------------------------------------- */
/*                            Widget Configurations                           */
/* -------------------------------------------------------------------------- */

export const mockWidgets: WidgetConfig[] = [
  /* ====================== 📊 Executive Overview Dashboard ====================== */
  {
    id: 'exec-kpi-1',
    type: 'KPI',
    title: 'Total Applications Onboarded',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#3b82f6' },
  },
  {
    id: 'exec-kpi-2',
    type: 'KPI',
    title: 'Total Performance Tests Executed',
    dataSource: defaultDataSource,
    layout: { x: 2, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#10b981' },
  },
  {
    id: 'exec-kpi-3',
    type: 'KPI',
    title: 'Success vs. Failure Rate',
    dataSource: defaultDataSource,
    layout: { x: 4, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#f59e0b' },
  },
  {
    id: 'exec-kpi-4',
    type: 'KPI',
    title: 'Average Response Time',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#8b5cf6' },
  },
  {
    id: 'exec-kpi-5',
    type: 'KPI',
    title: 'Peak Throughput',
    dataSource: defaultDataSource,
    layout: { x: 8, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#06b6d4' },
  },
  {
    id: 'exec-kpi-6',
    type: 'KPI',
    title: 'Active Builds',
    dataSource: defaultDataSource,
    layout: { x: 10, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#ef4444' },
  },
  {
    id: 'exec-kpi-7',
    type: 'KPI',
    title: 'System Health Score',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 2, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#22c55e' },
  },
  {
    id: 'exec-line-1',
    type: 'CHART_LINE',
    title: 'Performance Trends Over Time',
    dataSource: defaultDataSource,
    layout: { x: 2, y: 2, w: 6, h: 4 },
    visuals: defaultVisuals,
  },
  {
    id: 'exec-table-1',
    type: 'TABLE',
    title: 'Recent Test Runs',
    dataSource: defaultDataSource,
    layout: { x: 8, y: 2, w: 4, h: 4 },
    visuals: {},
  },

  /* ====================== 🚀 Autoscript Module Insights ====================== */
  {
    id: 'autoscript-kpi-1',
    type: 'KPI',
    title: 'HAR Files Processed',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#3b82f6' },
  },
  {
    id: 'autoscript-kpi-2',
    type: 'KPI',
    title: 'JMX Files Generated',
    dataSource: defaultDataSource,
    layout: { x: 3, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#10b981' },
  },
  {
    id: 'autoscript-kpi-3',
    type: 'KPI',
    title: 'Script Success Rate',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#f59e0b' },
  },
  {
    id: 'autoscript-kpi-4',
    type: 'KPI',
    title: 'Avg Script Generation Time',
    dataSource: defaultDataSource,
    layout: { x: 9, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#8b5cf6' },
  },
  {
    id: 'autoscript-line-1',
    type: 'CHART_LINE',
    title: 'Script Conversion Accuracy Trend',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },
  {
    id: 'autoscript-table-1',
    type: 'TABLE',
    title: 'Error Logs & Validation Results',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 2, w: 6, h: 3 },
    visuals: {},
  },

  /* ====================== 📄 AutoNFR Insights ====================== */
  {
    id: 'autonfr-kpi-1',
    type: 'KPI',
    title: 'Total NFR Documents Generated',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#06b6d4' },
  },
  {
    id: 'autonfr-kpi-2',
    type: 'KPI',
    title: 'Avg Time Saved Per Document',
    dataSource: defaultDataSource,
    layout: { x: 3, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#10b981' },
  },
  {
    id: 'autonfr-kpi-3',
    type: 'KPI',
    title: 'Compliance Coverage',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#f59e0b' },
  },
  {
    id: 'autonfr-kpi-4',
    type: 'KPI',
    title: 'Document Approval Rate',
    dataSource: defaultDataSource,
    layout: { x: 9, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#8b5cf6' },
  },
  {
    id: 'autonfr-bar-1',
    type: 'CHART_BAR',
    title: 'Most Frequently Used Templates',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },
  {
    id: 'autonfr-line-1',
    type: 'CHART_LINE',
    title: 'Download & Usage Statistics',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },

  /* ====================== 🔗 AutoAnalysis Integrations Dashboard ====================== */
  {
    id: 'autoanalysis-kpi-1',
    type: 'KPI',
    title: 'Build Success Rate',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#22c55e' },
  },
  {
    id: 'autoanalysis-kpi-2',
    type: 'KPI',
    title: 'Build Failure Rate',
    dataSource: defaultDataSource,
    layout: { x: 3, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#ef4444' },
  },
  {
    id: 'autoanalysis-kpi-3',
    type: 'KPI',
    title: 'Average Test Duration',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#3b82f6' },
  },
  {
    id: 'autoanalysis-kpi-4',
    type: 'KPI',
    title: 'Active Integrations',
    dataSource: defaultDataSource,
    layout: { x: 9, y: 0, w: 3, h: 2 },
    visuals: { ...defaultVisuals, color: '#8b5cf6' },
  },
  {
    id: 'autoanalysis-bar-1',
    type: 'CHART_BAR',
    title: 'Build Success/Failure Rates by Project',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },
  {
    id: 'autoanalysis-line-1',
    type: 'CHART_LINE',
    title: 'Execution Trends Over Time',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },
  {
    id: 'autoanalysis-table-1',
    type: 'TABLE',
    title: 'Integration Status (GitHub, BlazeMeter, CI/CD)',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 5, w: 12, h: 3 },
    visuals: {},
  },

  /* ====================== 📈 ROI & Productivity Dashboard ====================== */
  {
    id: 'roi-kpi-1',
    type: 'KPI',
    title: 'Total Time Saved',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#22c55e' },
  },
  {
    id: 'roi-kpi-2',
    type: 'KPI',
    title: 'Manual Effort Reduction',
    dataSource: defaultDataSource,
    layout: { x: 2, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#10b981' },
  },
  {
    id: 'roi-kpi-3',
    type: 'KPI',
    title: 'Cost Savings',
    dataSource: defaultDataSource,
    layout: { x: 4, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#06b6d4' },
  },
  {
    id: 'roi-kpi-4',
    type: 'KPI',
    title: 'Automation Coverage',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#f59e0b' },
  },
  {
    id: 'roi-kpi-5',
    type: 'KPI',
    title: 'Return on Investment',
    dataSource: defaultDataSource,
    layout: { x: 8, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#8b5cf6' },
  },
  {
    id: 'roi-kpi-6',
    type: 'KPI',
    title: 'Productivity Improvement',
    dataSource: defaultDataSource,
    layout: { x: 10, y: 0, w: 2, h: 2 },
    visuals: { ...defaultVisuals, color: '#ec4899' },
  },
  {
    id: 'roi-line-1',
    type: 'CHART_LINE',
    title: 'Time Savings Trend',
    dataSource: defaultDataSource,
    layout: { x: 0, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },
  {
    id: 'roi-line-2',
    type: 'CHART_LINE',
    title: 'Cost Savings Over Time',
    dataSource: defaultDataSource,
    layout: { x: 6, y: 2, w: 6, h: 3 },
    visuals: defaultVisuals,
  },
  {
  id: 'roi-kpi-7',
  type: 'KPI',
  title: 'LLM Tokens Used',
  dataSource: defaultDataSource,
  layout: { x: 0, y: 5, w: 6, h: 2 },
  visuals: { ...defaultVisuals, color: '#6366f1' },
},
{
  id: 'roi-kpi-8',
  type: 'KPI',
  title: 'LLM Cost Used',
  dataSource: defaultDataSource,
  layout: { x: 6, y: 5, w: 6, h: 2 },
  visuals: { ...defaultVisuals, color: '#ef4444' },
},
];

/* -------------------------------------------------------------------------- */
/*                                Widget Data                                 */
/* -------------------------------------------------------------------------- */

export const mockWidgetData: Record<string, any> = {
  /* ====================== Executive Overview ====================== */
  'exec-kpi-1': { value: '24', trend: 3 },
  'exec-kpi-2': { value: '187', trend: 22 },
  'exec-kpi-3': { value: '79% / 21%', trend: -4 },
  'exec-kpi-4': { value: '1.4s', trend: 0 },
  'exec-kpi-5': { value: '1,200 TPS', trend: 12 },
  'exec-kpi-6': { value: '14', trend: 2 },
  'exec-kpi-7': { value: '92/100', trend: 5 },

  'exec-line-1': [
    { name: 'Jan', value: 1.8 },
    { name: 'Feb', value: 1.6 },
    { name: 'Mar', value: 1.5 },
    { name: 'Apr', value: 1.4 },
    { name: 'May', value: 1.3 },
    { name: 'Jun', value: 1.4 },
  ],

  'exec-table-1': [
    { id: '1', name: 'Checkout Service - Load', status: 'success', timestamp: '2h ago' },
    { id: '2', name: 'Payment Gateway - Stress', status: 'failed', timestamp: '5h ago' },
    { id: '3', name: 'Inventory API - Soak', status: 'success', timestamp: '1d ago' },
    { id: '4', name: 'Auth Service - Smoke', status: 'success', timestamp: '2d ago' },
  ],

  /* ====================== Autoscript Insights ====================== */
  'autoscript-kpi-1': { value: '320', trend: 15 },
  'autoscript-kpi-2': { value: '142', trend: 12 },
  'autoscript-kpi-3': { value: '87%', trend: 5 },
  'autoscript-kpi-4': { value: '18 min', trend: -6 },

  'autoscript-line-1': [
    { name: 'Week 1', value: 82 },
    { name: 'Week 2', value: 85 },
    { name: 'Week 3', value: 84 },
    { name: 'Week 4', value: 87 },
  ],

  'autoscript-table-1': [
    { id: '1', name: 'HAR validation failed - Missing headers', status: 'failed', timestamp: '3h ago' },
    { id: '2', name: 'JMX generation successful', status: 'success', timestamp: '8h ago' },
    { id: '3', name: 'Script correlation issue detected', status: 'failed', timestamp: '12h ago' },
  ],

  /* ====================== AutoNFR Insights ====================== */
  'autonfr-kpi-1': { value: '61', trend: 9 },
  'autonfr-kpi-2': { value: '4h', trend: -20 },
  'autonfr-kpi-3': { value: '79%', trend: 4 },
  'autonfr-kpi-4': { value: '93%', trend: 8 },

  'autonfr-bar-1': [
    { build: 'E-commerce WLM', compliance: 45 },
    { build: 'Payments WLM', compliance: 38 },
    { build: 'Identity WLM', compliance: 32 },
    { build: 'API Gateway', compliance: 28 },
  ],

  'autonfr-line-1': [
    { name: 'Jan', value: 42 },
    { name: 'Feb', value: 48 },
    { name: 'Mar', value: 55 },
    { name: 'Apr', value: 61 },
    { name: 'May', value: 58 },
    { name: 'Jun', value: 61 },
  ],

  /* ====================== AutoAnalysis Dashboard ====================== */
  'autoanalysis-kpi-1': { value: '78%', trend: 5 },
  'autoanalysis-kpi-2': { value: '22%', trend: -5 },
  'autoanalysis-kpi-3': { value: '45 min', trend: -8 },
  'autoanalysis-kpi-4': { value: '5', trend: 1 },

  'autoanalysis-bar-1': [
    { build: 'Project Alpha', compliance: 88 },
    { build: 'Project Beta', compliance: 61 },
    { build: 'Project Gamma', compliance: 75 },
    { build: 'Migration Tool', compliance: 52 },
  ],

  'autoanalysis-line-1': [
    { name: 'Week 1', value: 65 },
    { name: 'Week 2', value: 72 },
    { name: 'Week 3', value: 68 },
    { name: 'Week 4', value: 78 },
    { name: 'Week 5', value: 75 },
    { name: 'Week 6', value: 80 },
  ],

  'autoanalysis-table-1': [
    { id: '1', name: 'GitHub Actions', status: 'success', timestamp: 'Active - 24 workflows' },
    { id: '2', name: 'BlazeMeter', status: 'success', timestamp: 'Active - 187 runs' },
    { id: '3', name: 'Jenkins CI/CD', status: 'failed', timestamp: 'Connection issue' },
    { id: '4', name: 'GitLab CI', status: 'success', timestamp: 'Active - 15 pipelines' },
  ],

  /* ====================== ROI & Productivity Dashboard ====================== */
  'roi-kpi-1': { value: '1,240 hrs', trend: 18 },
  'roi-kpi-2': { value: '65%', trend: 12 },
  'roi-kpi-3': { value: '$93K', trend: 22 },
  'roi-kpi-4': { value: '34%', trend: 8 },
  'roi-kpi-5': { value: '320%', trend: 25 },
  'roi-kpi-6': { value: '2.8x', trend: 15 },

  'roi-line-1': [
    { name: 'Jan', value: 180 },
    { name: 'Feb', value: 240 },
    { name: 'Mar', value: 320 },
    { name: 'Apr', value: 420 },
    { name: 'May', value: 580 },
    { name: 'Jun', value: 1240 },
  ],

  'roi-line-2': [
    { name: 'Jan', value: 12 },
    { name: 'Feb', value: 18 },
    { name: 'Mar', value: 28 },
    { name: 'Apr', value: 42 },
    { name: 'May', value: 68 },
    { name: 'Jun', value: 93 },
  ],
};