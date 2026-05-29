"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { StatsResponse } from "@/lib/types";

const colors = ["#34d399", "#f59e0b", "#22d3ee", "#f87171", "#a78bfa", "#fb7185"];

export function GrowthCharts({ stats }: { stats: StatsResponse }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartBox title="EXP Growth">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={stats.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23303d" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
            <Area type="monotone" dataKey="exp" stroke="#34d399" fill="#34d399" fillOpacity={0.22} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>
      <ChartBox title="Daily Study Minutes">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23303d" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
            <Bar dataKey="minutes" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
      <ChartBox title="Accuracy vs Wrong Answer Rate">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#23303d" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
            <Line type="monotone" dataKey="accuracy" stroke="#34d399" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="wrong_answer_rate" stroke="#f87171" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
      <ChartBox title="Subject Distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={stats.subjects} dataKey="minutes" nameKey="subject" innerRadius={58} outerRadius={94} paddingAngle={3}>
              {stats.subjects.map((entry, index) => <Cell key={entry.subject} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid #334155" }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border bg-card/80 p-5">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
