"use client"

import { SearchX } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Listing } from "@/types/marketplace"
import { ListingCard } from "@/components/ListingCard"

interface ListingGridProps {
  listings: Listing[]
  savedIds: Set<string>
  onToggleSave: (id: string) => void
  viewMode: "grid" | "list"
  onResetFilters: () => void
}

export function ListingGrid({
  listings,
  savedIds,
  onToggleSave,
  viewMode,
  onResetFilters,
}: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
        <SearchX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-serif text-lg font-semibold text-foreground">No listings match your filters</p>
          <p className="text-sm text-muted-foreground">Try widening your search or clearing a few filters.</p>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reset filters
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3"
          : "flex flex-col gap-4",
      )}
    >
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          saved={savedIds.has(listing.id)}
          onToggleSave={onToggleSave}
          layout={viewMode}
        />
      ))}
    </div>
  )
}
