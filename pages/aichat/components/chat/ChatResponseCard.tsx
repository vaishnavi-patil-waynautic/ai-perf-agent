import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ChatMessageData } from '../../types/chat.types';

interface Props {
  data: ChatMessageData;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e5e5',
      borderRadius: 8, padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13,
    }}>
      <div style={{ color: '#6b7280', marginBottom: 3, fontSize: 12 }}>
        {payload[0]?.payload?.endpoint}
      </div>
      <div style={{ color: '#111', fontWeight: 600 }}>
        {Number(payload[0]?.value).toFixed(4)}
        <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: 4 }}>TPS</span>
      </div>
    </div>
  );
};

const ChatResponseCard: React.FC<Props> = ({ data }) => {
  const [view, setView] = useState<'chart' | 'table'>('chart');

  if (!data.results || !data.visualization) return null;

  // Dynamically derive x/y keys from visualization config
  const xKey = data.visualization.group_by;   // e.g. "api_endpoints"
  const yKey = data.visualization.y_axes[0];  // e.g. "tps"

  const chartData = data.results.map(r => ({
    endpoint: String(r[xKey]),
    value: Number(r[yKey]),
  }));

  const max = Math.max(...chartData.map(d => d.value));

  return (
    <div style={{ fontFamily: 'inherit' }}>

      {/* Summary */}
{data.summary && (
  <p style={{ fontSize: 14, lineHeight: 1.8, color: '#374151', margin: '0 0 16px' }}>
    {data.summary.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color: '#111', fontWeight: 600 }}>{part}</strong>
        : <span key={i}>{part}</span>
    )}
  </p>
)}

      {/* Visualization card */}
      <div style={{
        border: '1px solid #e5e7eb', borderRadius: 12,
        overflow: 'hidden', marginBottom: 10,
      }}>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid #f3f4f6',
          background: '#fafafa',
        }}>
          <span style={{ fontSize: 12.5, color: '#9ca3af' }}>
            {yKey.toUpperCase()} by {xKey.replace('_', ' ')}
          </span>
          <div style={{
            display: 'flex', gap: 1,
            background: '#efefef', borderRadius: 6, padding: 2,
          }}>
            {(['chart', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? '#fff' : 'transparent',
                border: 'none', borderRadius: 5,
                padding: '3px 11px', fontSize: 12,
                color: view === v ? '#111' : '#9ca3af',
                fontWeight: view === v ? 500 : 400,
                cursor: 'pointer',
                boxShadow: view === v ? '0 1px 2px rgba(0,0,0,0.07)' : 'none',
                transition: 'all 0.12s',
                fontFamily: 'inherit',
              }}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        {view === 'chart' && (
          <div style={{ padding: '20px 8px 8px 0', background: '#fff' }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 16, left: 0, bottom: 52 }}
                barCategoryGap="35%"
              >
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="endpoint"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  angle={-38} textAnchor="end"
                  interval={0} tickLine={false} axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false} axisLine={false}
                  tickFormatter={v => v.toFixed(1)} width={34}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]} maxBarSize={32}>
                  {chartData.map((r, i) => (
                    <Cell key={i} fill={r.value === max ? '#111827' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Table */}
        {view === 'table' && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Endpoint', 'Value', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '9px 16px',
                    textAlign: i === 0 ? 'left' : 'right',
                    color: '#9ca3af', fontWeight: 500, fontSize: 12,
                    borderBottom: '1px solid #f3f4f6',
                    background: '#fafafa',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...chartData].sort((a, b) => b.value - a.value).map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{
                    padding: '9px 16px',
                    color: r.value === max ? '#111' : '#374151',
                    fontWeight: r.value === max ? 600 : 400,
                  }}>
                    {r.endpoint}
                    {r.value === max && (
                      <span style={{
                        marginLeft: 8, fontSize: 11, color: '#6b7280',
                        background: '#f3f4f6', padding: '1px 7px',
                        borderRadius: 20, fontWeight: 400,
                      }}>peak</span>
                    )}
                  </td>
                  <td style={{
                    padding: '9px 16px', textAlign: 'right',
                    color: r.value === max ? '#111' : '#6b7280',
                    fontWeight: r.value === max ? 600 : 400,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {r.value.toFixed(4)}
                  </td>
                  <td style={{ padding: '9px 16px 9px 0', width: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end' }}>
                      <div style={{ width: 64, height: 3, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${(r.value / max) * 100}%`,
                          background: r.value === max ? '#111' : '#d1d5db',
                          borderRadius: 4,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#9ca3af', minWidth: 28, textAlign: 'right' }}>
                        {((r.value / max) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer meta */}
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#9ca3af' }}>
        {data.table_used && <span>{data.table_used}</span>}
        {data.execution_time_ms && <><span>·</span><span>{data.execution_time_ms.toFixed(1)}ms</span></>}
        {data.detection_method && <><span>·</span><span>{data.detection_method.replace('_', ' ')}</span></>}
      </div>
    </div>
  );
};

export default ChatResponseCard;