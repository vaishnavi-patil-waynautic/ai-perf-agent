import ReactECharts from 'echarts-for-react';

export const HeatmapWidget = ({ data }: any) => {
  const option = {
    tooltip: { 
      position: 'top',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 500
      },
      extraCssText: 'border-radius: 12px; backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);'
    },
    grid: { 
      height: '65%', 
      top: '15%',
      left: '12%',
      right: '5%',
      containLabel: true
    },
    xAxis: { 
      type: 'category', 
      data: ['12a', '4a', '8a', '12p', '4p', '8p'], 
      splitArea: { 
        show: true,
        areaStyle: {
          color: ['rgba(250, 250, 250, 0.5)', 'rgba(255, 255, 255, 0.5)']
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: 500
      }
    },
    yAxis: { 
      type: 'category', 
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 
      splitArea: { 
        show: true,
        areaStyle: {
          color: ['rgba(250, 250, 250, 0.5)', 'rgba(255, 255, 255, 0.5)']
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        fontWeight: 500
      }
    },
    visualMap: { 
      min: 0, 
      max: 2000, 
      calculable: true, 
      orient: 'horizontal', 
      left: 'center', 
      bottom: '5%',
      inRange: {
        color: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1e40af']
      },
      textStyle: {
        color: '#64748b',
        fontSize: 11
      },
      itemWidth: 20,
      itemHeight: 140,
    },
    series: [{
      name: 'Response Time (ms)',
      type: 'heatmap',
      data: data,
      label: { 
        show: false 
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          borderColor: '#fff',
          borderWidth: 2
        }
      },
      itemStyle: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#fff'
      }
    }]
  };

  return <ReactECharts option={option} style={{ height: '280px' }} />;
};