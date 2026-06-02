import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { groupByDay, groupByWeek, groupByMonth, DAY_LIMIT, WEEK_LIMIT, $2, fmtDate, fmtWeek, fmtMonth } from '../utils/data'

const TIP = { background: '#fff', border: '1px solid #E2D9CF', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(28,16,8,0.1)' }

function Tip({ active, payload, label, mode }) {
  if (!active || !payload?.length) return null
  return (
    <div style={TIP}>
      <div style={{ fontSize: 11, color: '#A8998C', marginBottom: 3 }}>
        {mode === 'day' ? fmtDate(label) : mode === 'week' ? `Week of ${fmtWeek(label)}` : fmtMonth(label)}
      </div>
      <div style={{ fontWeight: 800, color: '#7B1E35', fontSize: 17 }}>{$2(payload[0].value)}</div>
    </div>
  )
}

const MODES = [
  { key: 'day',   label: 'Day',   window: `Last ${DAY_LIMIT} days` },
  { key: 'week',  label: 'Week',  window: `Last ${WEEK_LIMIT} weeks` },
  { key: 'month', label: 'Month', window: 'All time' },
]

export default function SpendChart({ receipts }) {
  const [mode, setMode] = useState('day')

  const data =
    mode === 'day'   ? groupByDay(receipts) :
    mode === 'week'  ? groupByWeek(receipts) :
                       groupByMonth(receipts)

  const xKey = mode === 'day' ? 'date' : mode === 'week' ? 'week' : 'month'

  const xFmt =
    mode === 'day'   ? v => v.slice(5) :
    mode === 'week'  ? fmtWeek :
                       fmtMonth

  const windowLabel = MODES.find(m => m.key === mode)?.window

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', align: 'baseline', gap: 10 }}>
          <div className="card-label" style={{ margin: 0 }}>Spend Over Time</div>
          <div style={{ fontSize: 10, color: '#A8998C', marginTop: 1 }}>{windowLabel}</div>
        </div>
        <div className="toggle">
          {MODES.map(m => (
            <button key={m.key} className={`tbtn${mode === m.key ? ' on' : ''}`} onClick={() => setMode(m.key)}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#7B1E35" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#7B1E35" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
          <XAxis dataKey={xKey} tickFormatter={xFmt} tick={{ fontSize: 10, fill: '#A8998C' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(1)+'k' : v}`} tick={{ fontSize: 10, fill: '#A8998C' }} axisLine={false} tickLine={false} width={50} />
          <Tooltip content={<Tip mode={mode} />} />
          <Area type="monotone" dataKey="total" stroke="#7B1E35" strokeWidth={2.5} fill="url(#g1)" dot={false} activeDot={{ r: 4, fill: '#7B1E35', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
