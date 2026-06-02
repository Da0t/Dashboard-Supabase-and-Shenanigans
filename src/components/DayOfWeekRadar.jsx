import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip
} from 'recharts'
import { groupByDayOfWeek, $2 } from '../utils/data'

const TIP = {
  background: '#fff', border: '1px solid #E2D9CF', borderRadius: 8,
  padding: '10px 14px', boxShadow: '0 4px 16px rgba(28,16,8,0.1)'
}

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={TIP}>
      <div style={{ fontWeight: 700, color: '#1C1008', marginBottom: 3 }}>{d.day}</div>
      <div style={{ fontSize: 12, color: '#A8998C' }}>
        Total: <strong style={{ color: '#7B1E35' }}>{$2(d.total)}</strong>
      </div>
      <div style={{ fontSize: 12, color: '#A8998C' }}>
        Receipts: <strong style={{ color: '#2B7A7A' }}>{d.count}</strong>
      </div>
    </div>
  )
}

export default function DayOfWeekRadar({ receipts }) {
  const data = groupByDayOfWeek(receipts)
  const maxTotal = Math.max(...data.map(d => d.total), 1)

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div className="card-label" style={{ margin: 0 }}>Spend by Day of Week</div>
        <div style={{ fontSize: 10, color: '#A8998C' }}>All time · hover for details</div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#E2D9CF" />
          <PolarAngleAxis
            dataKey="day"
            tick={{ fontSize: 11, fontWeight: 600, fill: '#6B5A50' }}
          />
          <PolarRadiusAxis domain={[0, maxTotal]} tick={false} axisLine={false} />
          <Radar
            dataKey="total"
            stroke="#7B1E35"
            fill="#7B1E35"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{ r: 3, fill: '#7B1E35', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#7B1E35' }}
          />
          <Tooltip content={<Tip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
