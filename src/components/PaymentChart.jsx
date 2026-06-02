import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { byPaymentMethod, $2 } from '../utils/data'

const COLORS = { CARD: '#2B7A7A', CASH: '#C9A84C', CONTACTLESS: '#7B1E35', UNKNOWN: '#A8998C' }
const TIP = { background: '#fff', border: '1px solid #E2D9CF', borderRadius: 8, padding: '10px 14px', boxShadow: '0 4px 16px rgba(28,16,8,0.1)' }

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={TIP}>
      <div style={{ fontWeight: 700, color: COLORS[d.name] || '#1C1008', marginBottom: 3 }}>{d.name}</div>
      <div style={{ color: '#A8998C' }}>Total: <strong style={{ color: '#7B1E35' }}>{$2(d.value)}</strong></div>
      <div style={{ color: '#A8998C' }}>Count: {d.payload.count} receipts</div>
    </div>
  )
}

export default function PaymentChart({ receipts }) {
  const data = byPaymentMethod(receipts)
  return (
    <div className="card">
      <div className="card-label">Payment Method</div>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie data={data} dataKey="total" cx="50%" cy="45%" innerRadius={52} outerRadius={82} paddingAngle={3}>
            {data.map((d, i) => <Cell key={i} fill={COLORS[d.name] || '#525878'} />)}
          </Pie>
          <Tooltip content={<Tip />} />
          <Legend formatter={v => <span style={{ fontSize: 11, color: '#A8998C' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
