// // import {
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// //   Cell,
// // } from "recharts";

// // export default function BarChartView({ data, visualization }: any) {
// //   if (!data?.length) return null;

// //   const xKey =
// //     visualization?.group_by ||
// //     visualization?.x_axis ||
// //     Object.keys(data[0])[0];

// //   const yKey =
// //     visualization?.y_axes?.[0] ||
// //     Object.keys(data[0])[1];

// //   const grouped: Record<string, number[]> = {};

// //   data.forEach((r: any) => {
// //     const x = String(r?.[xKey] ?? "Unknown");
// //     const y = Number(r?.[yKey] ?? 0);
// //     if (!grouped[x]) grouped[x] = [];
// //     grouped[x].push(y);
// //   });

// //   const chartData = Object.entries(grouped).map(([k, values]) => ({
// //     name: k,
// //     value: values.reduce((a, b) => a + b, 0) / values.length,
// //   }));

// //   const colors = [
// //     "#dbeafe",
// //     "#bfdbfe",
// //     "#93c5fd",
// //     "#60a5fa",
// //     "#3b82f6",
// //     "#2563eb",
// //   ];

// //   return (
// //     <div style={{ width: "100%", height: 260, padding: 10 }}>
// //       <ResponsiveContainer>
// //         <BarChart data={chartData}>
// //           <XAxis dataKey="name" />
// //           <YAxis />
// //           <Tooltip />
// //           <Bar dataKey="value" radius={[4, 4, 0, 0]}>
// //             {chartData.map((_, i) => (
// //               <Cell key={i} fill={colors[i % colors.length]} />
// //             ))}
// //           </Bar>
// //         </BarChart>
// //       </ResponsiveContainer>
// //     </div>
// //   );
// // }


// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
// } from "recharts";

// export default function BarChartView({ data, visualization }: any) {
//   if (!data?.length) return null;

//   const xKey =
//     visualization?.group_by ||
//     visualization?.x_axis ||
//     Object.keys(data[0])[0];

//   const yKey =
//     visualization?.y_axes?.[0] ||
//     Object.keys(data[0])[1];

//   const chartData = data.map((row: any) => ({
//     name: String(row[xKey]),
//     value: Number(row[yKey]),
//   }));

//   const colors = [
//     "#dbeafe",
//     "#bfdbfe",
//     "#93c5fd",
//     "#60a5fa",
//     "#3b82f6",
//     "#2563eb",
//   ];

//   return (
//     <div style={{ minWidth: chartData.length * 70 }}>
//       <div style={{ height: 300, padding: 12 }}>
//         <ResponsiveContainer>
//           <BarChart data={chartData}>
//             <XAxis
//               dataKey="name"
//               interval={0}
//               angle={-30}
//               textAnchor="end"
//               height={60}
//               label={{
//                 value: xKey.replace("_", " "),
//                 position: "insideBottom",
//                 offset: -45,
//               }}
//             />
//             <YAxis
//               label={{
//                 value: yKey.replace("_", " "),
//                 angle: -90,
//                 position: "insideLeft",
//               }}
//             />
//             <Tooltip />
//             <Bar dataKey="value" radius={[6, 6, 0, 0]}>
//               {chartData.map((_, i) => (
//                 <Cell key={i} fill={colors[i % colors.length]} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// export default function BarChartView({ data, visualization }: any) {
//   if (!data?.length) return null;

//   const xKey =
//     visualization?.group_by ||
//     visualization?.x_axis ||
//     Object.keys(data[0])[0];

//   const yKey =
//     visualization?.y_axes?.[0] ||
//     Object.keys(data[0])[1];

//   const chartData = data.map((row: any) => ({
//     name: String(row[xKey]),
//     value: Number(row[yKey]),
//   }));

//   const colors = [
//     "#dbeafe",
//     "#bfdbfe",
//     "#93c5fd",
//     "#60a5fa",
//     "#3b82f6",
//     "#2563eb",
//   ];

//   return (
//     <div style={{ width: "80%", overflowX: "auto" }}>
//       {/* Inner expands, outer scrolls */}
//       <div style={{ width: Math.max(chartData.length * 70, 600), height: 300 }}>
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData}>
//             <XAxis
//               dataKey="name"
//               interval={0}
//               angle={-30}
//               textAnchor="end"
//               height={60}
//               label={{
//                 value: xKey.replace("_", " "),
//                 position: "insideBottom",
//                 offset: -45,
//               }}
//             />
//             <YAxis
//               label={{
//                 value: yKey.replace("_", " "),
//                 angle: -90,
//                 position: "insideLeft",
//               }}
//             />
//             <Tooltip />
//             <Bar dataKey="value" radius={[6, 6, 0, 0]}>
//               {chartData.map((_, i) => (
//                 <Cell key={i} fill={colors[i % colors.length]} />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }

export default function BarChartView({ data, visualization }: any) {
  if (!data?.length) return null;

  const xKey =
    visualization?.group_by ||
    visualization?.x_axis ||
    Object.keys(data[0])[0];

  const yKey =
    visualization?.y_axes?.[0] ||
    Object.keys(data[0])[1];

  const chartData = data.map((row: any) => ({
    name: String(row[xKey]),
    value: Number(row[yKey]),
  }));


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


  // return (
  //   <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
  //     <div style={{ minWidth: 600, height: 300 }}>
  //       <ResponsiveContainer width="100%" height="100%">
  //         <BarChart data={chartData}>
  //           <XAxis
  //             dataKey="name"
  //             interval={0}
  //             angle={-30}
  //             textAnchor="end"
  //             height={60}
  //             label={{
  //               value: xKey.replace("_", " "),
  //               position: "insideBottom",
  //               offset: -45,
  //             }}
  //           />
  //           <YAxis
  //             label={{
  //               value: yKey.replace("_", " "),
  //               angle: -90,
  //               position: "insideLeft",
  //             }}
  //           />
  //           <Tooltip />
  //           <Bar dataKey="value" radius={[6, 6, 0, 0]}>
  //             {chartData.map((_, i) => (
  //               <Cell key={i} fill={colors[i % colors.length]} />
  //             ))}
  //           </Bar>
  //         </BarChart>
  //       </ResponsiveContainer>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
  //     <div style={{ minWidth: 600, height: 300 }}>
  //       <ResponsiveContainer width="100%" height="100%">
  //         <BarChart data={chartData}>
  //           <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={60} />
  //           <YAxis />
  //           <Tooltip />
  //           <Bar dataKey="value" />
  //         </BarChart>
  //       </ResponsiveContainer>
  //     </div>
  //   </div>
  // );
}