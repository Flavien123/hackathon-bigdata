"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/lib/contexts/language-context"

interface Complaint {
  route_number: string
  level: string
}

interface ComplaintsLevelChartProps {
  complaints?: Complaint[]
  isLoading: boolean
}

export function ComplaintsLevelChart({ complaints, isLoading }: ComplaintsLevelChartProps) {
  const { t, language } = useLanguage()

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (!complaints || complaints.length === 0) {
    return <div className="flex h-[350px] items-center justify-center text-muted-foreground">{t("noData")}</div>
  }

  // Группировка по маршрутам и уровням
  const routeData = complaints.reduce(
    (acc, complaint) => {
      const route = complaint.route_number || "Неизвестно"
      if (!acc[route]) {
        acc[route] = { route: `№${route}`, high: 0, medium: 0, low: 0 }
      }
      const level = complaint.level || "medium"
      if (level === "high") acc[route].high++
      else if (level === "medium") acc[route].medium++
      else if (level === "low") acc[route].low++
      return acc
    },
    {} as Record<string, { route: string; high: number; medium: number; low: number }>,
  )

  const chartData = Object.values(routeData)
    .sort((a, b) => b.high + b.medium + b.low - (a.high + a.medium + a.low))
    .slice(0, 8)

  const chartConfig = {
    high: {
      label: t("high"),
      color: "#f43f5e", // rose-500
    },
    medium: {
      label: t("medium"),
      color: "#fbbf24", // amber-400
    },
    low: {
      label: t("low"),
      color: "#34d399", // emerald-400
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="route"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="circle"
          formatter={(value) => (
            <span className="text-sm text-muted-foreground">
              {chartConfig[value as keyof typeof chartConfig].label}
            </span>
          )}
        />
        <Bar dataKey="high" stackId="a" fill="var(--color-high)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="medium" stackId="a" fill="var(--color-medium)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="low" stackId="a" fill="var(--color-low)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
