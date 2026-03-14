'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { HabitComplianceItem } from '@/types'

interface HabitComplianceChartProps {
  data: HabitComplianceItem[]
}

export function HabitComplianceChart({ data }: HabitComplianceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        Sin hábitos registrados
      </div>
    )
  }

  const formatted = data.map((d) => ({
    name:       d.name.length > 12 ? d.name.slice(0, 12) + '…' : d.name,
    percentage: d.percentage,
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
        <Tooltip
          formatter={(value: any) => [`${value}%`, 'Cumplimiento']}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
          {formatted.map((_, i) => (
            <Cell
              key={i}
              fill={_ .percentage >= 70 ? '#0D9488' : _ .percentage >= 40 ? '#A78BFA' : '#CBD5E1'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
