"use client"

import { useEffect, useMemo, useState } from "react"
import type { Listing, MarketplaceFilters, SortOption } from "@/types/marketplace"
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

function normalizeListing(item: any): Listing {
  const condition = item.condition
  let normalizedCondition: Listing["condition"] = "Good"

  if (condition === "Like New" || condition === "NEW" || condition === "New") {
    normalizedCondition = "Like New"
  } else if (condition === "Excellent") {
    normalizedCondition = "Excellent"
  } else if (condition === "Fair") {
    normalizedCondition = "Fair"
  } else if (condition === "Good") {
    normalizedCondition = "Good"
  }

  return {
    id: String(item.id),
    itemName: item.itemName ?? item.title ?? "Item",
    title: item.title ?? "Untitled listing",
    imageUrl: item.imageUrl || "/placeholder.svg",
    originalPrice: Number(item.originalPrice ?? 0),
    salePrice: Number(item.salePrice ?? 0),
    datePosted: item.datePosted ?? "Recent",
    seller: {
      id: String(item.seller?.id ?? "unknown"),
      name: item.seller?.name ?? "Seller",
    },
    condition: normalizedCondition,
    category: item.category ?? "Furniture",
    itemType: item.itemType ?? "Item",
    space: item.space ?? "Living Room",
    bundleEligible: Boolean(item.bundleEligible),
    distanceMiles: Number(item.distanceMiles ?? 0),
    deliveryOptions: Array.isArray(item.deliveryOptions) ? item.deliveryOptions : [],
    isSaved: Boolean(item.isSaved),
  }
}

export function MarketplaceApp() {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<MarketplaceFilters>(defaultFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    let isMounted = true

    async function loadListings() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/listings/")
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        if (isMounted) {
          setListings(Array.isArray(payload) ? payload.map(normalizeListing) : [])
        }
      } catch (error) {
        console.error("Failed to load listings from Django API", error)
        if (isMounted) {
          setListings([])
        }
      }
    }

    loadListings()

    return () => {
      isMounted = false
    }
  }, [])

  const results = useMemo(
    () => applyFilters(listings, filters, search),
    [listings, filters, search],
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
