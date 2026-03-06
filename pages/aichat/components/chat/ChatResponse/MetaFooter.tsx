export default function MetaFooter({ data }: any) {
  return (
    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
      {data.table_used && <span>{data.table_used}</span>}
      {data.execution_time_ms && (
        <>
          <span> · </span>
          <span>{data.execution_time_ms.toFixed(1)}ms</span>
        </>
      )}
      {data.detection_method && (
        <>
          <span> · </span>
          <span>{data.detection_method}</span>
        </>
      )}
    </div>
  );
}