import { top10, $2, fmtDate } from '../utils/data'

const METHOD_COLOR = { CARD: '#2B7A7A', CASH: '#C9A84C', CONTACTLESS: '#7B1E35' }

export default function TopTable({ receipts }) {
  const rows = top10(receipts)
  return (
    <div className="card">
      <div className="card-label">Top 10 Transactions</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['#', 'Date', 'Ref', 'Subtotal', 'Tax', 'Method', 'Total'].map(h => (
              <th key={h} style={{ textAlign: h === 'Total' ? 'right' : 'left', padding: '0 10px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.7px', color: '#A8998C', borderBottom: '1px solid #E2D9CF' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id} style={{ borderBottom: '1px solid #F5F0E8' }}>
              <td style={{ padding: '10px', color: i < 3 ? '#7B1E35' : '#A8998C', fontWeight: 700, fontSize: 11 }}>{i + 1}</td>
              <td style={{ padding: '10px', color: '#A8998C', fontSize: 12 }}>{fmtDate(r.date)}</td>
              <td style={{ padding: '10px', color: '#A8998C', fontFamily: 'monospace', fontSize: 12 }}>{r.transaction_ref || '—'}</td>
              <td style={{ padding: '10px', color: '#1C1008' }}>{r.subtotal != null ? $2(r.subtotal) : '—'}</td>
              <td style={{ padding: '10px', color: '#A8998C', fontSize: 12 }}>{r.tax_amount != null ? $2(r.tax_amount) : '—'}</td>
              <td style={{ padding: '10px' }}>
                <span style={{ background: `${METHOD_COLOR[r.payment_method] || '#A8998C'}18`, color: METHOD_COLOR[r.payment_method] || '#A8998C', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                  {r.payment_method || '—'}
                </span>
              </td>
              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 800, color: '#C9A84C', fontSize: 15 }}>{$2(r.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
