import React, { useState } from "react";

export default function DataTableView({ data }: any) {
  if (!data?.length) return null;

  console.log("[Rendering Table------------------------------------------]");

  const keys = Object.keys(data[0]);

  // Component to handle truncation and toggle
  const TruncatedCell = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);
    const limit = 50;

    if (!text) return null;

    const isLong = text.length > limit;
    const displayText =
      expanded || !isLong ? text : text.slice(0, limit) + "...";

    return (
      <span>
        {displayText}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginLeft: 6,
              color: "#2563eb",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )}
      </span>
    );
  };

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
      <table
        style={{
          borderCollapse: "collapse",
          fontSize: 13,
          width: "100%",
          minWidth: 600,
          tableLayout: "auto",
        }}
      >
        <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <tr style={{ background: "#e0f2fe" }}>
            {keys.map((k) => (
              <th
                key={k}
                style={{
                  padding: 10,
                  textAlign: "left",
                  borderBottom: "1px solid #bae6fd",
                  whiteSpace: "nowrap",
                }}
              >
                {k.replace(/_/g, " ")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row: any, i: number) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid #f1f5f9",
                background: i % 2 === 0 ? "#fff" : "#f8fafc",
              }}
            >
              {keys.map((k) => {
                const cellValue = row[k];
                const text =
                  cellValue !== null && cellValue !== undefined
                    ? String(cellValue)
                    : "";

                return (
                  <td
                    key={k}
                    style={{
                      padding: 10,
                      whiteSpace: "nowrap",
                      maxWidth: 300,
                    }}
                  >
                    <TruncatedCell text={text} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}