import ReactECharts from 'echarts-for-react';

export const HeatmapWidget = ({ data }: any) => {
  const option = {
    tooltip: { position: 'top' },
    grid: { height: '70%', top: '10%' },
    xAxis: { type: 'category', data: ['12a', '4a', '8a', '12p', '4p', '8p'], splitArea: { show: true } },
    yAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], splitArea: { show: true } },
    visualMap: { min: 0, max: 2000, calculable: true, orient: 'horizontal', left: 'center', bottom: '0%' },
    series: [{
      name: 'Response Time (ms)',
      type: 'heatmap',
      data: data, // [[x, y, value], ...]
      label: { show: false },
    }]
  };

  return <ReactECharts option={option} style={{ height: '250px' }} />;
};