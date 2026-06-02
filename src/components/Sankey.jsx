import { ResponsiveSankey } from '@nivo/sankey'
import { sankeyData, $2 } from '../utils/data'

const METHOD_COLORS = { CARD: '#2B7A7A', CASH: '#C9A84C', CONTACTLESS: '#7B1E35', UNKNOWN: '#A8998C' }
const MONTH_COLOR = '#9E6B54'

function nodeColor(node) {
  return METHOD_COLORS[node.id] || MONTH_COLOR
}

export default function Sankey({ receipts }) {
  const { nodes, links } = sankeyData(receipts)

  if (!nodes.length) {
    return (
      <div className="card">
        <div className="card-label">Monthly Flow</div>
        <div className="empty">No data</div>
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="card-label">Monthly Spend Flow — hover any node</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#A8998C' }}>
          <span><span style={{ color: MONTH_COLOR }}>■</span> Month</span>
          <span><span style={{ color: '#2B7A7A' }}>■</span> Card</span>
          <span><span style={{ color: '#C9A84C' }}>■</span> Cash</span>
          <span><span style={{ color: '#7B1E35' }}>■</span> Contactless</span>
        </div>
      </div>
      <div style={{ height: 300 }}>
        <ResponsiveSankey
          data={{ nodes, links }}
          margin={{ top: 8, right: 140, bottom: 8, left: 140 }}
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
          theme={{
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
          }}
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
      </div>
    </div>
  )
}
