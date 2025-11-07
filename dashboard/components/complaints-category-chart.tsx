"use client"

import { Cell, Pie, PieChart } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/lib/contexts/language-context"

interface Complaint {
  category: string
}

interface ComplaintsCategoryChartProps {
  complaints?: Complaint[]
  isLoading: boolean
}

const COLORS = [
  "#f43f5e", // rose
  "#f97316", // orange
  "#fbbf24", // amber
  "#84cc16", // lime
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
]

export function ComplaintsCategoryChart({ complaints, isLoading }: ComplaintsCategoryChartProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  if (!complaints || complaints.length === 0) {
    return <div className="flex h-[350px] items-center justify-center text-muted-foreground">{t("noData")}</div>
  }

  // Подсчет по категориям
  const categoryCounts = complaints.reduce(
    (acc, complaint) => {
      const category = complaint.category || "other"
      acc[category] = (acc[category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(categoryCounts).map(([category, count], index) => ({
    category,
    count,
    label: t(category as any) || category,
    fill: COLORS[index % COLORS.length],
  }))

  const chartConfig = chartData.reduce(
    (acc, item) => {
      acc[item.category] = {
        label: item.label,
        color: item.fill,
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="label"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
