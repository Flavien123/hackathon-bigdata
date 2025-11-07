"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Bus, MapPin } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/lib/contexts/language-context"

interface Complaint {
  route_number: string
  bus_number: string
  category: string
  level: string
}

interface StatsCardsProps {
  complaints?: Complaint[]
  isLoading: boolean
}

export function StatsCards({ complaints, isLoading }: StatsCardsProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalComplaints = complaints?.length || 0
  const uniqueRoutes = new Set(complaints?.map((c) => c.route_number)).size
  const highLevelComplaints = complaints?.filter((c) => c.level === "high").length || 0

  const stats = [
    {
      title: t("totalComplaints"),
      value: totalComplaints,
      icon: AlertTriangle,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: t("routesWithComplaints"),
      value: uniqueRoutes,
      icon: Bus,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: t("highPriority"),
      value: highLevelComplaints,
      icon: MapPin,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
