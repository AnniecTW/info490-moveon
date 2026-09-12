"use client"

import { X } from "lucide-react"
import type { MarketplaceFilters } from "@/types/marketplace"
import { PRICE_MIN, PRICE_MAX, DISTANCE_MAX, defaultFilters } from "@/data/filters"
import { formatDistanceLabel } from "@/lib/marketplace-utils"

interface Chip {
  key: string
  label: string
  onRemove: () => void
}

interface SelectedFilterChipsProps {
  filters: MarketplaceFilters
  onChange: (filters: MarketplaceFilters) => void
  onReset: () => void
}

export function SelectedFilterChips({ filters, onChange, onReset }: SelectedFilterChipsProps) {
  const chips: Chip[] = []

  filters.categories.forEach((category) =>
    chips.push({
      key: `cat-${category}`,
      label: category,
      onRemove: () =>
        onChange({ ...filters, categories: filters.categories.filter((c) => c !== category) }),
    }),
  )

  filters.itemTypes.forEach((type) =>
    chips.push({
      key: `type-${type}`,
      label: type,
      onRemove: () =>
        onChange({ ...filters, itemTypes: filters.itemTypes.filter((t) => t !== type) }),
    }),
  )

  filters.conditions.forEach((condition) =>
    chips.push({
      key: `cond-${condition}`,
      label: condition,
      onRemove: () =>
        onChange({ ...filters, conditions: filters.conditions.filter((c) => c !== condition) }),
    }),
  )

  filters.spaces.forEach((space) =>
    chips.push({
      key: `space-${space}`,
      label: space,
      onRemove: () => onChange({ ...filters, spaces: filters.spaces.filter((s) => s !== space) }),
    }),
  )

  filters.deliveryOptions.forEach((option) =>
    chips.push({
      key: `del-${option}`,
      label: option,
      onRemove: () =>
        onChange({
          ...filters,
          deliveryOptions: filters.deliveryOptions.filter((d) => d !== option),
        }),
    }),
  )

  if (filters.bundleEligibleOnly) {
    chips.push({
      key: "bundle",
      label: "Bundle Eligible",
      onRemove: () => onChange({ ...filters, bundleEligibleOnly: false }),
    })
  }

  if (filters.minPrice !== PRICE_MIN || filters.maxPrice !== PRICE_MAX) {
    const max = filters.maxPrice >= PRICE_MAX ? `${PRICE_MAX}+` : `${filters.maxPrice}`
    chips.push({
      key: "price",
      label: `$${filters.minPrice} – $${max}`,
      onRemove: () => onChange({ ...filters, minPrice: PRICE_MIN, maxPrice: PRICE_MAX }),
    })
  }

  if (filters.distanceRadiusMiles !== DISTANCE_MAX) {
    chips.push({
      key: "distance",
      label: formatDistanceLabel(filters.distanceRadiusMiles),
      onRemove: () => onChange({ ...filters, distanceRadiusMiles: DISTANCE_MAX }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Filters
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pl-3 pr-2 text-xs font-medium text-foreground transition hover:border-foreground/30 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {chip.label}
          <X className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="ml-1 text-xs font-medium text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
      >
        Clear all
      </button>
    </div>
  )
}
