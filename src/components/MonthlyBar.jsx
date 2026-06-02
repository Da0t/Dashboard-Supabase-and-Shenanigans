import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { groupByMonth, fmtMonth, $2 } from '../utils/data'

const TIP = { background: '#fff', border: '1px solid #E2D9CF', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(28,16,8,0.1)' }

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={TIP}>
      <div style={{ fontSize: 11, color: '#A8998C', marginBottom: 3 }}>{fmtMonth(payload[0].payload.month)}</div>
      <div style={{ fontWeight: 800, color: '#C9A84C', fontSize: 17 }}>{$2(payload[0].value)}</div>
    </div>
  )
}

export default function MonthlyBar({ receipts }) {
  const data = groupByMonth(receipts)
  return (
    <div className="card">
      <div className="card-label">Spend by Month</div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
          <XAxis dataKey="month" tickFormatter={fmtMonth} tick={{ fontSize: 10, fill: '#A8998C' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} tick={{ fontSize: 10, fill: '#A8998C' }} axisLine={false} tickLine={false} width={46} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(201,168,76,0.06)' }} />
          <Bar dataKey="total" fill="#C9A84C" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
