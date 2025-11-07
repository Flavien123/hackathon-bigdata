"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/contexts/language-context"
import { CalendarIcon, Filter, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"

export interface FilterOptions {
  category: string
  level: string
  sortBy: string
  searchRoute: string
  dateRange?: DateRange
}

interface FiltersPanelProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
}

export function FiltersPanel({ filters, onFilterChange }: FiltersPanelProps) {
  const { t } = useLanguage()

  const handleReset = () => {
    onFilterChange({
      category: "all",
      level: "all",
      sortBy: "count",
      searchRoute: "",
      dateRange: undefined,
    })
  }

  return (
    <Card className="border-border/50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium">{t("filters")}</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search by Route */}
          <div className="space-y-2">
            <Label htmlFor="search-route" className="text-xs">
              {t("searchRoute")}
            </Label>
            <Input
              id="search-route"
              placeholder={t("routeNumber")}
              value={filters.searchRoute}
              onChange={(e) => onFilterChange({ ...filters, searchRoute: e.target.value })}
              className="h-9"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label htmlFor="category-filter" className="text-xs">
              {t("filterByCategory")}
            </Label>
            <Select value={filters.category} onValueChange={(value) => onFilterChange({ ...filters, category: value })}>
              <SelectTrigger id="category-filter" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCategories")}</SelectItem>
                <SelectItem value="delay">{t("delay")}</SelectItem>
                <SelectItem value="safety_issue">{t("safety_issue")}</SelectItem>
                <SelectItem value="cleanliness">{t("cleanliness")}</SelectItem>
                <SelectItem value="driver_behavior">{t("driver_behavior")}</SelectItem>
                <SelectItem value="technical_issue">{t("technical_issue")}</SelectItem>
                <SelectItem value="overcrowding">{t("overcrowding")}</SelectItem>
                <SelectItem value="route_issue">{t("route_issue")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Level Filter */}
          <div className="space-y-2">
            <Label htmlFor="level-filter" className="text-xs">
              {t("filterByLevel")}
            </Label>
            <Select value={filters.level} onValueChange={(value) => onFilterChange({ ...filters, level: value })}>
              <SelectTrigger id="level-filter" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allLevels")}</SelectItem>
                <SelectItem value="high">{t("high")}</SelectItem>
                <SelectItem value="medium">{t("medium")}</SelectItem>
                <SelectItem value="low">{t("low")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label htmlFor="sort-by" className="text-xs">
              {t("sortBy")}
            </Label>
            <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ ...filters, sortBy: value })}>
              <SelectTrigger id="sort-by" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">{t("byCount")}</SelectItem>
                <SelectItem value="route">{t("byRoute")}</SelectItem>
                <SelectItem value="time">{t("byTime")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label className="text-xs">{t("dateRange")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal",
                    !filters.dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "dd.MM")} - {format(filters.dateRange.to, "dd.MM")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "dd.MM.yyyy")
                    )
                  ) : (
                    <span>{t("selectDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={filters.dateRange}
                  onSelect={(range) => onFilterChange({ ...filters, dateRange: range })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button variant="outline" size="sm" onClick={handleReset} className="h-9 w-full bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("reset")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
