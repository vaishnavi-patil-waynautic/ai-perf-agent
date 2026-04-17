import { Box, Typography, Button } from '@mui/material';
import { KPIWidget } from '../../pages/governance/components/widgets/KPIWidget';
import { LineChartWidget } from '../../pages/governance/components/widgets/LineChartWidget';
import TableWidget from '../../pages/governance/components/widgets/TableWidget';
import { mockWidgetData } from '../../pages/governance/data/mockDashboard';

const mockNfrData = mockWidgetData['table-1'];
const trendData = mockWidgetData['line-1'];

const GovernanceOverview = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Governance Overview</Typography>
        <Button variant="outlined">Export Executive Report</Button>
      </Box>

      {/* Row 1: KPI cards */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
        {[
          { title: 'SLA Compliance', value: '98.2%', trend: 1.2 },
          { title: 'Critical Risks', value: '02', trend: -5 },
          { title: 'Avg Response Time', value: '450ms', trend: -12 },
          { title: 'Cost Savings', value: '$12,400', trend: 15 },
        ].map((kpi) => (
          <Box key={kpi.title} sx={{ flex: '1 1 200px', bgcolor: 'white', borderRadius: 4, border: '1px solid #f1f5f9', p: 2 }}>
            <KPIWidget
              config={{ id: kpi.title, type: 'KPI', title: kpi.title, dataSource: { url: '', method: 'GET' }, layout: { x: 0, y: 0, w: 3, h: 2 }, visuals: {} }}
              data={{ value: kpi.value, trend: kpi.trend }}
            />
          </Box>
        ))}
      </Box>

      {/* Row 2: Chart + Table */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '2 1 400px', p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Performance Trend (Build vs Build)</Typography>
          <LineChartWidget data={trendData} />
        </Box>
        <Box sx={{ flex: '1 1 280px', p: 3, bgcolor: 'white', borderRadius: 4, border: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent NFR Compliance</Typography>
          <TableWidget data={mockNfrData} />
        </Box>
      </Box>
    </Box>
  );
};

export default GovernanceOverview;
