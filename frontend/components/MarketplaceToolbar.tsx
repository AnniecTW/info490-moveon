"use client"

import { LayoutGrid, List, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MarketplaceFilters, SortOption } from "@/types/marketplace"
import { SORT_OPTIONS } from "@/data/filters"

interface MarketplaceToolbarProps {
  resultCount: number
  activeFilterCount: number
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onOpenFilters: () => void
}

export function MarketplaceToolbar({
  resultCount,
  activeFilterCount,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onOpenFilters,
}: MarketplaceToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-serif text-2xl font-medium text-foreground">Browse listings</h2>
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "listing" : "listings"} available near you
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[0.68rem] font-semibold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>

        <label className="relative inline-flex items-center">
          <span className="sr-only">Sort listings</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="appearance-none rounded-full border border-border bg-card py-2.5 pl-4 pr-9 text-sm font-medium text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3 h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>

        <div className="hidden items-center rounded-full border border-border bg-card p-1 sm:flex">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition",
              viewMode === "grid" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition",
              viewMode === "list" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
