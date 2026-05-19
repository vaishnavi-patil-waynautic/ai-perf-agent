import { useEffect, useMemo, useState } from "react";
import BarChartView from "./BarChartView";
import DataTableView from "./DataTableView";
import { Download, Copy } from "lucide-react";
import { Alert, Snackbar } from "@mui/material";

export default function VisualizationBlock({ data, visualization, chart_metadata }: any) {
  const [view, setView] = useState<"bar" | "table">("table");
  const [resolved, setResolved] = useState(false);
  const [copied, setCopied] = useState(false);



  console.log("In visaualization block - view : ", view, " | data : ", data, " | visualization : ", visualization)

  useEffect(() => {

    if (!visualization) return;

    if (visualization === "table") {
      setView("table");
    } else {
      setView("bar");
    }

    setResolved(true);
  }, []);

  // useEffect(() => {
  //   if (resolved) return;
  //   if (!visualization?.type) return;

  //   if (visualization.type === "table") {
  //     setView("table");
  //   } else {
  //     setView("bar");
  //   }

  //   setResolved(true);
  // }, [visualization?.type, resolved]);

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
    try {
      const csv = generateCSV();

      if (!csv || !csv.trim()) {
        console.error("CSV content is empty.");
        alert("No data available to copy.");
        return;
      }

      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(csv);
      } else {
        // Fallback for unsupported or insecure environments
        const textarea = document.createElement("textarea");
        textarea.value = csv;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "0";
        textarea.setAttribute("readonly", "");

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (!successful) {
          throw new Error("Fallback copy failed");
        }
      }

      setCopied(true);
      // Optional: show snackbar/toast here
    } catch (error) {
      console.error("Failed to copy CSV:", error);
      alert("Failed to copy CSV. Please try again.");
    }
  };

  return (

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


        <div style={{ display: "flex", gap: 4 }}>
          {(visualization !== "table") && (
            <button
              onClick={() => setView("bar")}
              style={toggleStyle(view === "bar")}
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
            onClick={downloadCSV}
            style={{
              cursor: "pointer",
              color: "#555",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              // e.currentTarget.style.color = "#1976d2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#555";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.9)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
            }}
          />

          <Copy
            size={18}
            onClick={copyCSV}
            style={{
              cursor: "pointer",
              color: "#555",
              transition: "transform 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              // e.currentTarget.style.color = "#1976d2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#555";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.9)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
            }}
          />
        </div>
      </div>

      {/* CONTENT */}
      {/* <div style={{ maxHeight: 380, overflow: "scroll" }}>
       */}
      <div style={{ maxHeight: 380, overflow: "auto", width: "100%" }}>
        {view === "bar" && (
          <BarChartView data={data} visualization={visualization} chart_metadata={chart_metadata} />
        )}
        {view === "table" && <DataTableView data={data} />}
      </div>



      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setCopied(false)}
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            fontWeight: 500,
            alignItems: "center",
          }}
        >
          Copied to clipboard!
        </Alert>
      </Snackbar>

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