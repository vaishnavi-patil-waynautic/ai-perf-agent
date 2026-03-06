// // export default function DataTableView({ data }: any) {
// //   if (!data?.length) return null;

// //   const keys = Object.keys(data[0]);

// //   return (
// //     <div style={{ overflowX: "auto" }}>
// //       <table
// //         style={{
// //           width: "100%",
// //           borderCollapse: "collapse",
// //           fontSize: 13,
// //         }}
// //       >
// //         <thead>
// //           <tr style={{ background: "#e0f2fe" }}>
// //             {keys.map((k) => (
// //               <th
// //                 key={k}
// //                 style={{
// //                   padding: 8,
// //                   textAlign: "left",
// //                   borderBottom: "1px solid #cbd5e1",
// //                 }}
// //               >
// //                 {k.replace(/_/g, " ")}
// //               </th>
// //             ))}
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {data.map((row: any, i: number) => (
// //             <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
// //               {keys.map((k) => (
// //                 <td key={k} style={{ padding: 8 }}>
// //                   {String(row[k])}
// //                 </td>
// //               ))}
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }


// export default function DataTableView({ data }: any) {
//   if (!data?.length) return null;

//   const keys = Object.keys(data[0]);

//   return (
//     <div style={{ overflowX: "auto" }}>
//       <table
//         style={{
//           width: "100%",
//           borderCollapse: "collapse",
//           fontSize: 13,
//         }}
//       >
//         <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
//           <tr style={{ background: "#e0f2fe" }}>
//             {keys.map((k) => (
//               <th
//                 key={k}
//                 style={{
//                   padding: 10,
//                   textAlign: "left",
//                   borderBottom: "1px solid #bae6fd",
//                 }}
//               >
//                 {k.replace(/_/g, " ")}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((row: any, i: number) => (
//             <tr
//               key={i}
//               style={{
//                 borderBottom: "1px solid #f1f5f9",
//                 background: i % 2 === 0 ? "#ffffff" : "#f8fafc",
//               }}
//             >
//               {keys.map((k) => (
//                 <td key={k} style={{ padding: 10 }}>
//                   {String(row[k])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// export default function DataTableView({ data }: any) {
//   if (!data?.length) return null;

//   const keys = Object.keys(data[0]);

//   return (
//     <div style={{ width: "80%", overflowX: "auto" }}>
//       {/* Table expands beyond container → scroll appears */}
//       <table
//         style={{
//           borderCollapse: "collapse",
//           fontSize: 13,
//           minWidth: keys.length * 140,   // dynamic width
//           width: "max-content",          // prevents shrinking
//         }}
//       >
//         <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
//           <tr style={{ background: "#e0f2fe" }}>
//             {keys.map((k) => (
//               <th
//                 key={k}
//                 style={{
//                   padding: 10,
//                   textAlign: "left",
//                   borderBottom: "1px solid #bae6fd",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {k.replace(/_/g, " ")}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((row: any, i: number) => (
//             <tr
//               key={i}
//               style={{
//                 borderBottom: "1px solid #f1f5f9",
//                 background: i % 2 === 0 ? "#fff" : "#f8fafc",
//               }}
//             >
//               {keys.map((k) => (
//                 <td
//                   key={k}
//                   style={{
//                     padding: 10,
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {String(row[k])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


export default function DataTableView({ data }: any) {
  if (!data?.length) return null;

  const keys = Object.keys(data[0]);

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
      <table
        style={{
          borderCollapse: "collapse",
          fontSize: 13,
          width: "100%",
          minWidth: 600,              // safe base width
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
              {keys.map((k) => (
                <td
                  key={k}
                  style={{
                    padding: 10,
                    whiteSpace: "nowrap",
                  }}
                >
                  {String(row[k])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}