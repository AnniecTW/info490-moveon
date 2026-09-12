"use client"

import { useMemo, useState } from "react"
import type { MarketplaceFilters, SortOption } from "@/types/marketplace"
import { listings } from "@/data/listings"
import { featuredBundles } from "@/data/featuredBundles"
import { defaultFilters } from "@/data/filters"
import { applyFilters, countActiveFilters } from "@/lib/marketplace-utils"
import { Header } from "@/components/Header"
import { MoveInBundlePromo } from "@/components/MoveInBundlePromo"
import { FeaturedBundleCarousel } from "@/components/FeaturedBundleCarousel"
import { MarketplaceToolbar } from "@/components/MarketplaceToolbar"
import { SelectedFilterChips } from "@/components/SelectedFilterChips"
import { ListingGrid } from "@/components/ListingGrid"
import { FilterDrawer } from "@/components/FilterDrawer"

export function MarketplaceApp() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<MarketplaceFilters>(defaultFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())

  const results = useMemo(
    () => applyFilters(listings, filters, search),
    [filters, search],
  )
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  const toggleSave = (id: string) =>
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const resetFilters = () => setFilters(defaultFilters)

  return (
    <div className="min-h-screen bg-background">
      <Header search={search} onSearchChange={setSearch} savedCount={savedIds.size} />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_2fr] lg:items-center lg:gap-12">
          <MoveInBundlePromo />
          <FeaturedBundleCarousel bundles={featuredBundles} />
        </section>

        <div className="mt-12 space-y-5">
          <MarketplaceToolbar
            resultCount={results.length}
            activeFilterCount={activeFilterCount}
            sort={filters.sort}
            onSortChange={(sort: SortOption) => setFilters((f) => ({ ...f, sort }))}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onOpenFilters={() => setDrawerOpen(true)}
          />

          <SelectedFilterChips filters={filters} onChange={setFilters} onReset={resetFilters} />

          <ListingGrid
            listings={results}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            viewMode={viewMode}
            onResetFilters={resetFilters}
          />
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row md:px-6">
          <p>MoveOn — a fresh start at a fair price.</p>
          <p>Curated secondhand furniture, built for move-in season.</p>
        </div>
      </footer>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
        resultCount={results.length}
      />
    </div>
  )
}
