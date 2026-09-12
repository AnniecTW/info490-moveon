"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  Category,
  Condition,
  DeliveryOption,
  MarketplaceFilters,
  Space,
} from "@/types/marketplace"
import {
  CATEGORIES,
  CONDITIONS,
  DELIVERY_OPTIONS,
  ITEM_TYPES_BY_CATEGORY,
  SPACES,
} from "@/data/filters"
import { FilterSection, CheckboxRow, TogglePill } from "@/components/FilterSection"
import { PriceRangeSlider } from "@/components/PriceRangeSlider"
import { DistanceSlider } from "@/components/DistanceSlider"

interface FilterDrawerProps {
  open: boolean
  onClose: () => void
  filters: MarketplaceFilters
  onChange: (filters: MarketplaceFilters) => void
  onReset: () => void
  resultCount: number
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onReset,
  resultCount,
}: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const availableItemTypes = filters.categories.length
    ? Array.from(new Set(filters.categories.flatMap((c) => ITEM_TYPES_BY_CATEGORY[c])))
    : Array.from(new Set(Object.values(ITEM_TYPES_BY_CATEGORY).flat()))

  return (
    <div className={cn("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none")}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filter and sort listings"
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Filter &amp; Sort</h2>
            <p className="text-xs text-muted-foreground">Refine your curated finds</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <FilterSection title="Category" count={filters.categories.length} defaultOpen>
            <div className="space-y-0.5">
              {CATEGORIES.map((category) => (
                <CheckboxRow
                  key={category}
                  label={category}
                  checked={filters.categories.includes(category)}
                  onToggle={() =>
                    onChange({
                      ...filters,
                      categories: toggle<Category>(filters.categories, category),
                      itemTypes: [],
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Item Type" count={filters.itemTypes.length}>
            <div className="flex flex-wrap gap-2">
              {availableItemTypes.map((type) => (
                <TogglePill
                  key={type}
                  label={type}
                  active={filters.itemTypes.includes(type)}
                  onToggle={() => onChange({ ...filters, itemTypes: toggle(filters.itemTypes, type) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Price Range" defaultOpen>
            <PriceRangeSlider
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={({ minPrice, maxPrice }) => onChange({ ...filters, minPrice, maxPrice })}
            />
          </FilterSection>

          <FilterSection title="Condition" count={filters.conditions.length}>
            <div className="space-y-0.5">
              {CONDITIONS.map((condition) => (
                <CheckboxRow
                  key={condition}
                  label={condition}
                  checked={filters.conditions.includes(condition)}
                  onToggle={() =>
                    onChange({
                      ...filters,
                      conditions: toggle<Condition>(filters.conditions, condition),
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Bundle Eligibility">
            <CheckboxRow
              label="Bundle Eligible only"
              checked={filters.bundleEligibleOnly}
              onToggle={() =>
                onChange({ ...filters, bundleEligibleOnly: !filters.bundleEligibleOnly })
              }
            />
          </FilterSection>

          <FilterSection title="Space" count={filters.spaces.length}>
            <div className="flex flex-wrap gap-2">
              {SPACES.map((space) => (
                <TogglePill
                  key={space}
                  label={space}
                  active={filters.spaces.includes(space)}
                  onToggle={() => onChange({ ...filters, spaces: toggle<Space>(filters.spaces, space) })}
                />
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Distance Radius">
            <DistanceSlider
              value={filters.distanceRadiusMiles}
              onChange={(distanceRadiusMiles) => onChange({ ...filters, distanceRadiusMiles })}
            />
          </FilterSection>

          <FilterSection title="Delivery / Meetup" count={filters.deliveryOptions.length}>
            <div className="space-y-0.5">
              {DELIVERY_OPTIONS.map((option) => (
                <CheckboxRow
                  key={option}
                  label={option}
                  checked={filters.deliveryOptions.includes(option)}
                  onToggle={() =>
                    onChange({
                      ...filters,
                      deliveryOptions: toggle<DeliveryOption>(filters.deliveryOptions, option),
                    })
                  }
                />
              ))}
            </div>
          </FilterSection>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View {resultCount} {resultCount === 1 ? "listing" : "listings"}
          </button>
        </div>
      </aside>
    </div>
  )
}
