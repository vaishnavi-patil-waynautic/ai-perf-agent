import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";


export default function BarChartView({ data, visualization, chart_metadata }: any) {
  if (!data?.length) return null;

  const xKey =
    chart_metadata?.x_axis ||
    visualization?.group_by ||
    visualization?.x_axis ||
    Object.keys(data[0])[0];

  const yKey =
    chart_metadata?.y_axes?.[0] ||
    chart_metadata?.y_axis?.[0] ||
    chart_metadata?.y_axis ||
    chart_metadata?.y_axes ||
    visualization?.y_axes?.[0] ||
    Object.keys(data[0])[1];

  const chartData = data.map((row: any) => ({
    name: String(row[xKey]),
    value: Number(row[yKey]),
  }));

  console.log(" In barchart - Data : ", data, " ||||||| visualisation : ", visualization, " |||||| chart metadata: ", chart_metadata, " ||| xkey : ", xKey, " |||| ykey: ", yKey)

  const colors = [
    "#dbeafe",
    "#bfdbfe",
    "#93c5fd",
    "#60a5fa",
    "#3b82f6",
    "#2563eb",
  ];


  const BAR_GAP = 12;           // gap between bars
  const CATEGORY_WIDTH = 60;    // width per category (controls spacing)
  const dynamicWidth = Math.max(600, chartData.length * CATEGORY_WIDTH);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div style={{ width: dynamicWidth, height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barCategoryGap="20%"   // space between category groups
            barGap={BAR_GAP}       // space between bars
          >
            <XAxis
              dataKey="name"
              interval={0}
              minTickGap={25}              // prevents tick collision
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11 }}
              tickMargin={10}
              label={{
                value: xKey.replace("_", " "),
                position: "insideBottom",
                offset: -60,
              }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: yKey?.replace("_", " "),
                angle: -90,
                position: "insideLeft",
                dx: 5,        // move slightly left
                dy: 60,
              }}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}   // prevents ultra-thick bars
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

}