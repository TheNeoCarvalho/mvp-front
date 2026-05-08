"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts"

const dados = [
  { dia: "Seg", Receita: 12000 },
  { dia: "Ter", Receita: 18000 },
  { dia: "Qua", Receita: 14000 },
  { dia: "Qui", Receita: 22000 },
  { dia: "Sex", Receita: 28000 },
  { dia: "Sáb", Receita: 24000 },
  { dia: "Dom", Receita: 32000 },
]

export default function GraficoReceita() {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dados}>
          <defs>
            <linearGradient
              id="colorReceita"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#2563EB"
                stopOpacity={0.4}
              />

              <stop
                offset="95%"
                stopColor="#2563EB"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="dia"
            stroke="#64748B"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0F172A",
              border: "1px solid #334155",
              borderRadius: "12px",
              color: "#fff",
            }}
          />

          <Area
            type="monotone"
            dataKey="Receita"
            stroke="#3B82F6"
            strokeWidth={3}
            fill="url(#colorReceita)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}