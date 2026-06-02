import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { countByWeek, VOL_LIMIT, fmtWeek } from '../utils/data'

const TIP = { background: '#fff', border: '1px solid #E2D9CF', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(28,16,8,0.1)' }

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={TIP}>
      <div style={{ fontSize: 11, color: '#A8998C', marginBottom: 3 }}>Week of {fmtWeek(label)}</div>
      <div style={{ fontWeight: 800, color: '#2B7A7A', fontSize: 17 }}>{payload[0].value} receipts</div>
    </div>
  )
}

export default function VolumeBar({ receipts }) {
  const data = countByWeek(receipts)
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <div className="card-label" style={{ margin: 0 }}>Receipt Volume by Week</div>
        <div style={{ fontSize: 10, color: '#A8998C' }}>Last {VOL_LIMIT} weeks</div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE4" />
          <XAxis dataKey="week" tickFormatter={fmtWeek} tick={{ fontSize: 10, fill: '#A8998C' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#A8998C' }} axisLine={false} tickLine={false} width={28} />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(43,122,122,0.05)' }} />
          <Bar dataKey="count" fill="#2B7A7A" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
