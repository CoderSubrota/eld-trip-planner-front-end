import React, { useEffect, useState } from 'react'

const ROWS = [
  { key: 'off', label: 'OFF', y: 20 },
  { key: 'sleeper', label: 'SB', y: 60 },
  { key: 'drive', label: 'D', y: 100 },
  { key: 'onduty', label: 'ON', y: 140 },
]

const HOUR_W = 24
const GRID_W = 24 * HOUR_W
const GRID_H = 160
const X0 = 60

function segToRow(type) {
  if (type === 'drive') return 'drive'
  if (type === 'break' || type === 'off') return 'off'
  if (type === 'pickup' || type === 'dropoff') return 'onduty'
  return 'onduty'
}

export default function ELDLog({ dayPlans }) {
  const [daySegments, setDaySegments] = useState({})

  const days = []
  let dayCounter = 1

  for (let i = 0; i < dayPlans.length; i++) {
    const e = dayPlans[i]
    days.push({ day: dayCounter, segments: e.segments })

    if (i < dayPlans.length - 1 && dayPlans[i + 1].segments?.[0]?.type === 'off') {
      days.push({ day: dayCounter, segments: dayPlans[i + 1].segments })
      i += 1
    }

    dayCounter += 1
  }

  const handleSegmentData = (day, data) => {
    setDaySegments(prev => ({ ...prev, [day]: data }))
  }

  useEffect(() => {
    console.log('Latest segment data:', daySegments)
  }, [daySegments])

  return (
    <section>
      <h2>Daily ELD Logs</h2>
      <div style={{ display: 'grid', gap: 24 }}>
        {days.map((d, i) => (
          <DayLog key={i} day={d.day} segments={d.segments} onData={handleSegmentData} />
        ))}
      </div>
    </section>
  )
}

function DayLog({ day, segments, onData }) {
  let t = 0
  const lines = []
  const segmentData = []

  segments.forEach((s, idx) => {
    const row = segToRow(s.type)
    const rowY = ({ off: 20, sleeper: 60, drive: 100, onduty: 140 })[row] || 140
    const w = (s.hours || 0) * HOUR_W
    const x1 = X0 + t * HOUR_W
    const x2 = x1 + w

    lines.push(
      <line
        key={idx}
        x1={x1}
        y1={rowY}
        x2={x2}
        y2={rowY}
        strokeWidth="6"
        stroke="#007bff"
      />
    )

    segmentData.push({ type: s.type, hours: s.hours, row, x1, x2, y: rowY })
    t += (s.hours || 0)
  })

  useEffect(() => {
    onData?.(day, segmentData)
  }, [day, segments]) 

  return (
    <div style={{
      overflowX: 'auto',
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      background: '#f9f9f9'
    }}>
      <div style={{
        marginBottom: 12,
        paddingBottom: 4,
        borderBottom: '2px solid #007bff',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#007bff'
      }}>
        Day {day}
      </div>
      <svg width={GRID_W + 80} height={GRID_H + 40}>
        {ROWS.map(r => (
          <g key={r.key}>
            <text x="10" y={r.y + 4} fontSize="12">{r.label}</text>
            <line x1={X0} y1={r.y} x2={X0 + GRID_W} y2={r.y} stroke="#ccc" />
          </g>
        ))}
        {[...Array(25)].map((_, h) => (
          <g key={h}>
            <line x1={X0 + h * HOUR_W} y1={20} x2={X0 + h * HOUR_W} y2={GRID_H} stroke="#eee" />
            {h < 24 && (
              <text x={X0 + h * HOUR_W + 4} y={GRID_H + 20} fontSize="10">{h}:00</text>
            )}
          </g>
        ))}
        {lines}
      </svg>
      <div style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
        Legend: OFF = Off-duty/Break, D = Driving, ON = On-duty (Pickup/Dropoff)
      </div>
    </div>
  )
}
