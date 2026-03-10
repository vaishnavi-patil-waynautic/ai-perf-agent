// import { useState } from "react";
// import BarChartView from "./BarChartView";
// import DataTableView from "./DataTableView";

// export default function VisualizationBlock({ data, visualization }: any) {
//   const [view, setView] = useState<"chart" | "table">(
//     visualization?.type ? "chart" : "table"
//   );

//   const containerStyle = {
//     border: "1px solid #e5e7eb",
//     borderRadius: 10,
//     marginTop: 10,
//     overflow: "hidden",
//     background: "#fff",
//   };

//   return (
//     <div style={containerStyle}>
//       {/* TOOLBAR */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "8px 12px",
//           borderBottom: "1px solid #f1f5f9",
//           background: "#f9fafb",
//         }}
//       >
//         <div style={{ fontSize: 12, color: "#64748b" }}>
//           Data Visualization
//         </div>

//         <div>
//           <button onClick={() => setView("chart")}>Chart</button>
//           <button onClick={() => setView("table")}>Table</button>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div style={{ maxHeight: 320, overflow: "auto" }}>
//         {view === "chart" && visualization && (
//           <BarChartView data={data} visualization={visualization} />
//         )}

//         {view === "table" && <DataTableView data={data} />}
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import BarChartView from "./BarChartView";
import DataTableView from "./DataTableView";
import { Download, Copy } from "lucide-react";

export default function VisualizationBlock({ data, visualization }: any) {
const [view, setView] = useState<"chart" | "table">("table");
const [resolved, setResolved] = useState(false);



console.log("In visaualization block - view : ", view, " | data : ", data, " | visualization : ", visualization)

useEffect(() => {
  if (resolved) return;
  if (!visualization?.type) return;

  if (visualization.type === "table") {
    setView("table");
  } else {
    setView("chart");
  }

  setResolved(true);
}, [visualization?.type, resolved]);

  const columns = useMemo(() => {
    if (!data?.length) return [];
    return Object.keys(data[0]);
  }, [data]);

  // ---------- CSV GENERATION ----------
  const generateCSV = () => {
    if (!data?.length) return "";

    const header = columns.join(",");
    const rows = data.map((row: any) =>
      columns.map((col) => `"${row[col] ?? ""}"`).join(",")
    );

    return [header, ...rows].join("\n");
  };

  const downloadCSV = () => {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyCSV = async () => {
    await navigator.clipboard.writeText(generateCSV());
  };

  return (
    // <div
    //   style={{
    //     border: "1px solid #e5e7eb",
    //     borderRadius: 12,
    //     marginTop: 12,
    //     background: "#fff",
    //     overflow: "hidden",
    //   }}
    // >

    <div
  style={{
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    marginTop: 12,
    background: "#fff",
    overflow: "hidden",
    width: "100%",
    maxWidth: "100%",
  }}
>
      {/* TOOLBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 12px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 2,
        }}
      >
        {/* Toggle */}
        {/* <div style={{ display: "flex", gap: 4 }}>
          {
            view === "chart" && (<button
            onClick={() => setView("chart")}
            style={toggleStyle(view === "chart")}
          >
            Chart
          </button>)
          }
          <button
            onClick={() => setView("table")}
            style={toggleStyle(view === "table")}
          >
            Table
          </button>
        </div> */}

        <div style={{ display: "flex", gap: 4 }}>
  {(visualization?.type!=="table") && (
    <button
      onClick={() => setView("chart")}
      style={toggleStyle(view === "chart")}
    >
      Chart
    </button>
  )}

  <button
    onClick={() => setView("table")}
    style={toggleStyle(view === "table")}
  >
    Table
  </button>
</div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <Download
            size={18}
            style={{ cursor: "pointer" }}
            onClick={downloadCSV}
          />
          <Copy size={18} style={{ cursor: "pointer" }} onClick={copyCSV} />
        </div>
      </div>

      {/* CONTENT */}
      {/* <div style={{ maxHeight: 380, overflow: "scroll" }}>
       */}
       <div style={{ maxHeight: 380, overflow: "auto", width: "100%" }}>
        {view === "chart"  && visualization?.type !== "table" && visualization && (
          <BarChartView data={data} visualization={visualization} />
        )}
        {view === "table" && <DataTableView data={data} />}
      </div>
    </div>
  );
}

const toggleStyle = (active: boolean) => ({
  padding: "4px 12px",
  fontSize: 12,
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  background: active ? "#3b82f6" : "#e2e8f0",
  color: active ? "#fff" : "#334155",
});