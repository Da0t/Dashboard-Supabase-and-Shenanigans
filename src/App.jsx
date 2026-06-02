import './index.css'
import { useState } from 'react'
import { useReceipts } from './hooks/useReceipts'
import { kpis, $, $2, fmtMonth } from './utils/data'
import Sankey from './components/Sankey'
import SpendChart from './components/SpendChart'
import PaymentChart from './components/PaymentChart'
import MonthlyBar from './components/MonthlyBar'
import VolumeBar from './components/VolumeBar'
import TopTable from './components/TopTable'
import DayOfWeekRadar from './components/DayOfWeekRadar'
import Summary from './components/Summary'

function KPI({ label, value, accent, details }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 6, letterSpacing: 0.2 }}>{label}</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: '#1C1008', letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 14 }}>{value}</div>
      {details && (
        <>
          <div style={{ height: 1, background: '#F0EBE4', marginBottom: 12 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {details.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: '#A8998C' }}>{d.label}</span>
                <span style={{ fontWeight: 600, color: d.color || '#6B5A50' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('dashboard')
  const { receipts, loading, error } = useReceipts()
  const { total, count, avg, thisWeek, wowPct, topMonth, lowMonth, maxTx, minTx } = kpis(receipts)

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <div className="logo-name">mila</div>
          <div className="logo-sub">fashions for women</div>
        </div>
        <div className="header-right">
          <div className="header-title">Expense Dashboard</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
            {['dashboard', 'summary'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? '#7B1E35' : 'transparent',
                  color: tab === t ? '#fff' : '#A8998C',
                  border: `1px solid ${tab === t ? '#7B1E35' : '#E2D9CF'}`,
                  borderRadius: 6,
                  padding: '4px 16px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'capitalize',
                }}
              >{t}</button>
            ))}
          </div>
        </div>
      </header>

      {error && (
        <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 14, color: '#F87171', fontSize: 13 }}>
          Supabase error: {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="ld" /><div className="ld" /><div className="ld" />
          <span style={{ marginLeft: 8 }}>Loading receipts…</span>
        </div>
      ) : tab === 'summary' ? (
        <Summary receipts={receipts} />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <KPI
              label="Total Spend"
              value={$2(total)}
              accent="#7B1E35"
              details={[
                { label: 'Receipts', value: count },
                { label: 'Largest transaction', value: maxTx ? $2(maxTx.total) : '—', color: '#7B1E35' },
                { label: 'Smallest transaction', value: minTx ? $2(minTx.total) : '—', color: '#2B7A7A' },
              ]}
            />
            <KPI
              label="Avg Transaction"
              value={$2(avg)}
              accent="#C9A84C"
              details={[
                { label: 'Highest month', value: topMonth ? `${fmtMonth(topMonth.month)} — ${$2(topMonth.total)}` : '—', color: '#7B1E35' },
                { label: 'Lowest month', value: lowMonth ? `${fmtMonth(lowMonth.month)} — ${$2(lowMonth.total)}` : '—', color: '#2B7A7A' },
              ]}
            />
            <KPI
              label="This Week"
              value={$(thisWeek)}
              accent="#9E6B54"
              details={[
                { label: 'Last 7 days', value: '' },
                { label: 'vs prior week', value: wowPct != null ? `${wowPct > 0 ? '+' : ''}${wowPct.toFixed(1)}%` : '—', color: wowPct == null ? '#A8998C' : wowPct > 0 ? '#DC2626' : '#16A34A' },
              ]}
            />
            <KPI
              label="Week over Week"
              value={wowPct != null ? `${wowPct > 0 ? '+' : ''}${wowPct.toFixed(1)}%` : '—'}
              accent={wowPct == null ? '#A8998C' : wowPct > 0 ? '#DC2626' : '#16A34A'}
              details={[
                { label: 'Compared to previous 7 days', value: '' },
                { label: wowPct > 0 ? 'Spending up' : wowPct < 0 ? 'Spending down' : 'No change', value: wowPct != null ? `${$2(Math.abs(thisWeek - (thisWeek / (1 + wowPct / 100))))}` : '—', color: wowPct > 0 ? '#DC2626' : '#16A34A' },
              ]}
            />
          </div>

          <div className="mb">
            <Sankey receipts={receipts} />
          </div>

          <div className="g21">
            <SpendChart receipts={receipts} />
            <VolumeBar receipts={receipts} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <MonthlyBar receipts={receipts} />
            <DayOfWeekRadar receipts={receipts} />
            <PaymentChart receipts={receipts} />
          </div>

          <TopTable receipts={receipts} />
        </>
      )}
    </div>
  )
}
