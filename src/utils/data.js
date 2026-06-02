// Real schema: id, transaction_ref, date, time, subtotal, tax_rate, tax_amount, total, payment_method, created_at

export const $ = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export const $2 = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

export function fmtDate(s) {
  if (!s) return '—'
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtMonth(ym) {
  if (!ym) return ''
  const [y, m] = ym.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export function fmtWeek(s) {
  if (!s) return ''
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function dayKey(r) { return (r.date || r.created_at || '').slice(0, 10) }
function monthKey(r) { return dayKey(r).slice(0, 7) }
function weekKey(r) {
  const d = new Date(dayKey(r))
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().slice(0, 10)
}

export function kpis(receipts) {
  const total = receipts.reduce((s, r) => s + Number(r.total || 0), 0)
  const count = receipts.length
  const avg = count ? total / count : 0

  const now = new Date()
  const w0 = new Date(now - 7 * 86400000)
  const w1 = new Date(now - 14 * 86400000)
  const thisWeek = receipts.filter(r => new Date(dayKey(r)) >= w0).reduce((s, r) => s + Number(r.total || 0), 0)
  const lastWeek = receipts.filter(r => { const d = new Date(dayKey(r)); return d >= w1 && d < w0 }).reduce((s, r) => s + Number(r.total || 0), 0)
  const wowPct = lastWeek ? ((thisWeek - lastWeek) / lastWeek) * 100 : null

  const byMonth = groupByMonth(receipts)
  const topMonth = byMonth.length ? byMonth.reduce((a, b) => b.total > a.total ? b : a) : null
  const lowMonth = byMonth.length ? byMonth.reduce((a, b) => b.total < a.total ? b : a) : null

  const sorted = [...receipts].sort((a, b) => Number(b.total || 0) - Number(a.total || 0))
  const maxTx = sorted[0] || null
  const minTx = sorted[sorted.length - 1] || null

  return { total, count, avg, thisWeek, lastWeek, wowPct, topMonth, lowMonth, maxTx, minTx }
}

// Cap day view to last 90 days — beyond that bars/points become unreadably thin
export const DAY_LIMIT = 90
// Cap week view to last 52 weeks (1 year)
export const WEEK_LIMIT = 52
// Cap weekly receipt count to same window
export const VOL_LIMIT = 52

export function groupByDay(receipts) {
  const map = {}
  receipts.forEach(r => {
    const k = dayKey(r); if (!k) return
    map[k] = (map[k] || 0) + Number(r.total || 0)
  })
  const all = Object.entries(map).map(([date, total]) => ({ date, total })).sort((a, b) => a.date.localeCompare(b.date))
  return all.slice(-DAY_LIMIT)
}

export function groupByWeek(receipts) {
  const map = {}
  receipts.forEach(r => {
    const k = weekKey(r); if (!k) return
    map[k] = (map[k] || 0) + Number(r.total || 0)
  })
  const all = Object.entries(map).map(([week, total]) => ({ week, total })).sort((a, b) => a.week.localeCompare(b.week))
  return all.slice(-WEEK_LIMIT)
}

export function groupByMonth(receipts) {
  const map = {}
  receipts.forEach(r => {
    const k = monthKey(r); if (!k) return
    map[k] = (map[k] || 0) + Number(r.total || 0)
  })
  return Object.entries(map).map(([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month))
}

export function countByWeek(receipts) {
  const map = {}
  receipts.forEach(r => {
    const k = weekKey(r); if (!k) return
    map[k] = (map[k] || 0) + 1
  })
  const all = Object.entries(map).map(([week, count]) => ({ week, count })).sort((a, b) => a.week.localeCompare(b.week))
  return all.slice(-VOL_LIMIT)
}

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// Start week on Monday
const DOW_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function groupByDayOfWeek(receipts) {
  const totals = {}, counts = {}
  DOW_ORDER.forEach(d => { totals[d] = 0; counts[d] = 0 })
  receipts.forEach(r => {
    const k = dayKey(r); if (!k) return
    const label = DOW[new Date(k).getDay()]
    totals[label] += Number(r.total || 0)
    counts[label] += 1
  })
  return DOW_ORDER.map(day => ({ day, total: totals[day], count: counts[day] }))
}

export function byPaymentMethod(receipts) {
  const map = {}
  receipts.forEach(r => {
    const m = (r.payment_method || 'UNKNOWN').toUpperCase()
    if (!map[m]) map[m] = { name: m, total: 0, count: 0 }
    map[m].total += Number(r.total || 0)
    map[m].count += 1
  })
  return Object.values(map).sort((a, b) => b.total - a.total)
}

export function top10(receipts) {
  return [...receipts].sort((a, b) => Number(b.total || 0) - Number(a.total || 0)).slice(0, 10)
}

// Sankey: month nodes → payment method nodes
// Keys internally use YYYY-MM so different years never collide.
// Nodes are sorted chronologically, not alphabetically.
export function sankeyData(receipts) {
  // map: "YYYY-MM||METHOD" → total
  const raw = {}
  receipts.forEach(r => {
    const mo = monthKey(r); if (!mo) return
    const method = (r.payment_method || 'UNKNOWN').toUpperCase()
    const key = `${mo}||${method}`
    raw[key] = (raw[key] || 0) + Number(r.total || 0)
  })

  // Collect unique YYYY-MM keys and sort chronologically
  const sortedMonths = [...new Set(Object.keys(raw).map(k => k.split('||')[0]))]
    .sort() // YYYY-MM sorts correctly as a string

  // Build a display label for each YYYY-MM, ensuring uniqueness across years
  // "Jan '26", "Jan '27" will be distinct
  const monthLabel = {}
  sortedMonths.forEach(mo => { monthLabel[mo] = fmtMonth(mo) })

  const methods = [...new Set(Object.keys(raw).map(k => k.split('||')[1]))]

  const nodes = [
    ...sortedMonths.map(mo => ({ id: monthLabel[mo] })),
    ...methods.map(id => ({ id })),
  ]

  const links = Object.entries(raw)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => {
      const [mo, target] = key.split('||')
      return { source: monthLabel[mo], target, value: Math.round(value * 100) / 100 }
    })

  return { nodes, links }
}
