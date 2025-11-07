"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/lib/contexts/language-context"

interface Complaint {
  route_number: string
  bus_number: string
}

interface ComplaintsBarChartProps {
  complaints?: Complaint[]
  isLoading: boolean
  sortBy?: string
}

const COLORS = [
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#84cc16", // lime
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
]

export function ComplaintsBarChart({ complaints, isLoading, sortBy = "count" }: ComplaintsBarChartProps) {
  const { t, language } = useLanguage()

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  if (!complaints || complaints.length === 0) {
    return <div className="flex h-[400px] items-center justify-center text-muted-foreground">{t("noData")}</div>
  }

  // Подсчет жалоб по маршрутам
  const routeCounts = complaints.reduce(
    (acc, complaint) => {
      const key = complaint.route_number || "Неизвестно"
      acc[key] = (acc[key] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Преобразование в массив и сортировка
  let chartData = Object.entries(routeCounts).map(([route, count]) => ({
    route: `${t("route")} ${route}`,
    routeNum: route,
    count,
  }))

  if (sortBy === "route") {
    chartData.sort((a, b) => a.routeNum.localeCompare(b.routeNum))
  } else if (sortBy === "count") {
    chartData.sort((a, b) => b.count - a.count)
  }

  chartData = chartData.slice(0, 10)

  const chartDataWithColors = chartData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }))

  const chartConfig = {
    count: {
      label: t("complaintsCount"),
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <BarChart data={chartDataWithColors} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="route"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          <LabelList dataKey="count" position="top" fill="hsl(var(--foreground))" fontSize={12} fontWeight={600} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
