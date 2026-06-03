import { useState, useEffect } from 'react'
import { ResponsiveSankey } from '@nivo/sankey'
import { sankeyData, $2 } from '../utils/data'

const METHOD_COLORS = { CARD: '#2B7A7A', CASH: '#C9A84C', CONTACTLESS: '#7B1E35', UNKNOWN: '#A8998C' }
const MONTH_COLOR = '#9E6B54'

function nodeColor(node) {
  return METHOD_COLORS[node.id] || MONTH_COLOR
}

const THEME = {
  background: 'transparent',
  text: { fill: '#A8998C', fontSize: 11, fontFamily: 'inherit' },
  tooltip: {
    container: {
      background: '#fff',
      border: '1px solid #E2D9CF',
      borderRadius: 8,
      color: '#1C1008',
      fontSize: 12,
      padding: '10px 14px',
      boxShadow: '0 4px 16px rgba(28,16,8,0.1)',
    },
  },
}

function SankeyChart({ data, height, margin }) {
  return (
    <ResponsiveSankey
      data={data}
      margin={margin}
      align="justify"
      colors={nodeColor}
      nodeOpacity={1}
      nodeThickness={20}
      nodeInnerPadding={4}
      nodeSpacing={20}
      nodeBorderWidth={0}
      nodeBorderRadius={4}
      linkOpacity={0.3}
      linkHoverOpacity={0.65}
      linkContract={3}
      enableLinkGradient
      labelPosition="outside"
      labelOrientation="horizontal"
      labelPadding={14}
      labelTextColor={{ from: 'color', modifiers: [['brighter', 1.4]] }}
      animate
      theme={THEME}
      tooltip={({ node }) => (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 3, color: '#1C1008' }}>{node.id}</div>
          <div style={{ color: '#A8998C' }}>Total: <strong style={{ color: '#7B1E35' }}>{$2(node.value)}</strong></div>
        </div>
      )}
      linkTooltip={({ link }) => (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 3 }}>{link.source.id} → {link.target.id}</div>
          <div style={{ color: '#A8998C' }}><strong style={{ color: '#7B1E35' }}>{$2(link.value)}</strong></div>
        </div>
      )}
    />
  )
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#A8998C' }}>
      <span><span style={{ color: MONTH_COLOR }}>■</span> Month</span>
      <span><span style={{ color: '#2B7A7A' }}>■</span> Card</span>
      <span><span style={{ color: '#C9A84C' }}>■</span> Cash</span>
      <span><span style={{ color: '#7B1E35' }}>■</span> Contactless</span>
    </div>
  )
}

export default function Sankey({ receipts }) {
  const [expanded, setExpanded] = useState(false)
  const chartData = sankeyData(receipts)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [expanded])

  if (!chartData.nodes.length) {
    return (
      <div className="card">
        <div className="card-label">Monthly Spend Flow</div>
        <div className="empty">No data</div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="card-label" style={{ margin: 0 }}>Monthly Spend Flow — hover any node</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Legend />
            <button
              onClick={() => setExpanded(true)}
              title="Expand"
              style={{
                background: 'none', border: '1px solid #E2D9CF', borderRadius: 6,
                padding: '4px 8px', cursor: 'pointer', color: '#A8998C',
                fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center',
              }}
            >⤢</button>
          </div>
        </div>
        <div style={{ height: 300 }}>
          <SankeyChart data={chartData} margin={{ top: 8, right: 140, bottom: 8, left: 140 }} />
        </div>
      </div>

      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(28,16,8,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 32,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: 28,
              width: '100%', maxWidth: 1200,
              boxShadow: '0 24px 64px rgba(28,16,8,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1C1008' }}>Monthly Spend Flow</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Legend />
                <button
                  onClick={() => setExpanded(false)}
                  style={{
                    background: 'none', border: '1px solid #E2D9CF', borderRadius: 6,
                    padding: '4px 10px', cursor: 'pointer', color: '#A8998C',
                    fontSize: 16, lineHeight: 1,
                  }}
                >✕</button>
              </div>
            </div>
            <div style={{ height: 520 }}>
              <SankeyChart data={chartData} margin={{ top: 12, right: 180, bottom: 12, left: 180 }} />
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: '#A8998C', textAlign: 'center' }}>
              Press Esc or click outside to close
            </div>
          </div>
        </div>
      )}
    </>
  )
}
