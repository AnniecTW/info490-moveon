"use client"

import { PRICE_MIN, PRICE_MAX } from "@/data/filters"

interface PriceRangeSliderProps {
  minPrice: number
  maxPrice: number
  onChange: (range: { minPrice: number; maxPrice: number }) => void
}

const STEP = 5

export function PriceRangeSlider({ minPrice, maxPrice, onChange }: PriceRangeSliderProps) {
  const range = PRICE_MAX - PRICE_MIN
  const leftPct = ((minPrice - PRICE_MIN) / range) * 100
  const rightPct = ((maxPrice - PRICE_MIN) / range) * 100

  const maxLabel = maxPrice >= PRICE_MAX ? `$${PRICE_MAX}+` : `$${maxPrice}`

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="rounded-md bg-secondary px-2 py-1 font-medium text-foreground">${minPrice}</span>
        <span className="text-xs text-muted-foreground">Price range</span>
        <span className="rounded-md bg-secondary px-2 py-1 font-medium text-foreground">{maxLabel}</span>
      </div>

      <div className="relative h-[18px]">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={minPrice}
          aria-label="Minimum price"
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), maxPrice - STEP)
            onChange({ minPrice: Math.max(PRICE_MIN, next), maxPrice })
          }}
          className="range-input absolute inset-0"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={STEP}
          value={maxPrice}
          aria-label="Maximum price"
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), minPrice + STEP)
            onChange({ minPrice, maxPrice: Math.min(PRICE_MAX, next) })
          }}
          className="range-input absolute inset-0"
        />
      </div>
    </div>
  )
}
