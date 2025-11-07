"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ComplaintsBarChart } from "@/components/complaints-bar-chart"
import { ComplaintsLevelChart } from "@/components/complaints-level-chart"
import { ComplaintsCategoryChart } from "@/components/complaints-category-chart"
import { StatsCards } from "@/components/stats-cards"
import { SettingsMenu } from "@/components/settings-menu"
import { FiltersPanel, type FilterOptions } from "@/components/filters-panel"
import { useLanguage } from "@/lib/contexts/language-context"
import useSWR from "swr"
import { Activity, AlertCircle, TrendingUp } from "lucide-react"
import { useState, useMemo } from "react"
import { isWithinInterval, parseISO } from "date-fns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/complaints"

const fetcher = async (url: string) => {
  console.log("[v0] Fetching from URL:", url)

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      mode: "cors",
    })

    console.log("[v0] Response status:", res.status)

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    console.log("[v0] Data received:", data?.length || 0, "complaints")
    return data
  } catch (error) {
    console.error("[v0] Fetch error:", error)
    throw error
  }
}

export default function DashboardPage() {
  const { t } = useLanguage()
  const {
    data: complaints,
    error,
    isLoading,
  } = useSWR(API_URL, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    errorRetryInterval: 2000,
  })

  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    level: "all",
    sortBy: "count",
    searchRoute: "",
  })

  const filteredComplaints = useMemo(() => {
    if (!complaints) return []

    let filtered = [...complaints]

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter((c) => c.category === filters.category)
    }

    // Filter by level
    if (filters.level !== "all") {
      filtered = filtered.filter((c) => c.level === filters.level)
    }

    // Filter by route search
    if (filters.searchRoute) {
      filtered = filtered.filter((c) => c.route_number?.includes(filters.searchRoute))
    }

    // Filter by date range
    if (filters.dateRange?.from) {
      filtered = filtered.filter((c) => {
        if (!c.time) return false
        try {
          const complaintDate = parseISO(c.time)
          const from = filters.dateRange!.from!
          const to = filters.dateRange?.to || from

          return isWithinInterval(complaintDate, { start: from, end: to })
        } catch {
          return false
        }
      })
    }

    return filtered
  }, [complaints, filters])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>{t("errorLoading")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t("errorMessage")}</p>
            <div className="mt-4 rounded-md bg-muted p-3">
              <p className="text-xs font-mono text-muted-foreground">API URL: {API_URL}</p>
              <p className="mt-2 text-xs font-mono text-destructive">{error?.message || String(error)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 animate-pulse text-emerald-500" />
                <span>{t("updating")}</span>
              </div>
              <SettingsMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <StatsCards complaints={filteredComplaints} isLoading={isLoading} />

        <div className="mt-6">
          <FiltersPanel filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Charts Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Проблемные маршруты */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-rose-500" />
                    {t("problematicRoutes")}
                  </CardTitle>
                  <CardDescription className="mt-1.5">{t("topRoutes")}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ComplaintsBarChart complaints={filteredComplaints} isLoading={isLoading} sortBy={filters.sortBy} />
            </CardContent>
          </Card>

          {/* Распределение по уровням */}
          <Card>
            <CardHeader>
              <CardTitle>{t("levelDistribution")}</CardTitle>
              <CardDescription className="mt-1.5">{t("levelStackChart")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintsLevelChart complaints={filteredComplaints} isLoading={isLoading} />
            </CardContent>
          </Card>

          {/* Частота категорий */}
          <Card>
            <CardHeader>
              <CardTitle>{t("categoryFrequency")}</CardTitle>
              <CardDescription className="mt-1.5">{t("categoryDistribution")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ComplaintsCategoryChart complaints={filteredComplaints} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
