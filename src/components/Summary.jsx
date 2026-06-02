import { kpis, groupByMonth, byPaymentMethod, groupByDayOfWeek, top10, $, $2, fmtMonth, fmtDate } from '../utils/data'

const DOW_FULL = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }

function StatRow({ label, value, sub, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #F0EBE4' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1C1008' }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: '#A8998C', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: 15, fontWeight: 800, color: accent || '#7B1E35' }}>{value}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#A8998C', marginBottom: 2 }}>{children}</div>
}

function Table({ headers, rows }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={{
              textAlign: i === 0 ? 'left' : 'right',
              padding: '0 12px 10px',
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.7px', color: '#A8998C',
              borderBottom: '2px solid #E2D9CF'
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} style={{
                textAlign: j === 0 ? 'left' : 'right',
                padding: '11px 12px',
                borderBottom: '1px solid #F0EBE4',
                color: j === 0 ? '#1C1008' : '#6B5A50',
                fontWeight: j === row.length - 1 ? 700 : 400,
                color: j === row.length - 1 ? '#7B1E35' : j === 0 ? '#1C1008' : '#6B5A50',
              }}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function Summary({ receipts }) {
  const { total, count, avg, thisWeek, wowPct, topMonth } = kpis(receipts)
  const months = groupByMonth(receipts)
  const methods = byPaymentMethod(receipts)
  const dow = groupByDayOfWeek(receipts)
  const top = top10(receipts)

  const busiest = [...dow].sort((a, b) => b.total - a.total)[0]
  const quietest = [...dow].filter(d => d.count > 0).sort((a, b) => a.total - b.total)[0]
  const topMethod = methods[0]
  const totalTx = count

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Overview */}
        <div className="card">
          <SectionTitle>Overview</SectionTitle>
          <StatRow label="Total Spend" value={$2(total)} />
          <StatRow label="Total Receipts" value={totalTx} />
          <StatRow label="Average Transaction" value={$2(avg)} />
          <StatRow label="This Week" value={$(thisWeek)} sub="last 7 days" accent="#9E6B54" />
          {wowPct != null && (
            <StatRow
              label="Week over Week"
              value={`${wowPct > 0 ? '+' : ''}${wowPct.toFixed(1)}%`}
              accent={wowPct > 0 ? '#DC2626' : '#16A34A'}
            />
          )}
        </div>

        {/* Highlights */}
        <div className="card">
          <SectionTitle>Highlights</SectionTitle>
          {topMonth && (
            <StatRow label="Highest Spend Month" value={$2(topMonth.total)} sub={fmtMonth(topMonth.month)} />
          )}
          {busiest && (
            <StatRow label="Busiest Day of Week" value={DOW_FULL[busiest.day]} sub={`${$2(busiest.total)} avg total spend`} accent="#C9A84C" />
          )}
          {quietest && (
            <StatRow label="Slowest Day of Week" value={DOW_FULL[quietest.day]} sub={`${$2(quietest.total)} total spend`} accent="#2B7A7A" />
          )}
          {topMethod && (
            <StatRow label="Preferred Payment" value={topMethod.name} sub={`${topMethod.count} receipts — ${((topMethod.total / total) * 100).toFixed(1)}% of spend`} accent="#9E6B54" />
          )}
          <StatRow label="Date Range" value={`${fmtDate(months[0]?.month + '-01')} – now`} accent="#A8998C" />
        </div>

        {/* Payment method breakdown */}
        <div className="card">
          <SectionTitle>Payment Methods</SectionTitle>
          <div style={{ marginTop: 8 }}>
            <Table
              headers={['Method', 'Receipts', 'Total', '% of Spend']}
              rows={methods.map(m => [
                m.name,
                m.count,
                $2(m.total),
                `${((m.total / total) * 100).toFixed(1)}%`,
              ])}
            />
          </div>
        </div>
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Monthly breakdown */}
        <div className="card">
          <SectionTitle>Monthly Breakdown</SectionTitle>
          <div style={{ marginTop: 8 }}>
            <Table
              headers={['Month', 'Receipts', 'Total', 'Avg']}
              rows={[...months].reverse().map(m => {
                const mReceipts = receipts.filter(r => (r.date || r.created_at || '').slice(0, 7) === m.month)
                return [
                  fmtMonth(m.month),
                  mReceipts.length,
                  $2(m.total),
                  $2(m.total / (mReceipts.length || 1)),
                ]
              })}
            />
          </div>
        </div>

        {/* Day of week breakdown */}
        <div className="card">
          <SectionTitle>Day of Week Breakdown</SectionTitle>
          <div style={{ marginTop: 8 }}>
            <Table
              headers={['Day', 'Receipts', 'Total', 'Avg per Receipt']}
              rows={dow.map(d => [
                DOW_FULL[d.day],
                d.count,
                $2(d.total),
                d.count ? $2(d.total / d.count) : '—',
              ])}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
