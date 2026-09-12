"use client"

import { DISTANCE_MIN, DISTANCE_MAX } from "@/data/filters"
import { formatDistanceLabel } from "@/lib/marketplace-utils"

interface DistanceSliderProps {
  value: number
  onChange: (miles: number) => void
}

export function DistanceSlider({ value, onChange }: DistanceSliderProps) {
  const pct = ((value - DISTANCE_MIN) / (DISTANCE_MAX - DISTANCE_MIN)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-xs text-muted-foreground">Distance radius</span>
        <span className="rounded-md bg-secondary px-2 py-1 font-medium text-foreground">
          {formatDistanceLabel(value)}
        </span>
      </div>

      <div className="relative h-[18px]">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-border" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gold"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={DISTANCE_MIN}
          max={DISTANCE_MAX}
          step={1}
          value={value}
          aria-label="Distance radius in miles"
          onChange={(event) => onChange(Number(event.target.value))}
          className="range-input absolute inset-0"
        />
      </div>

      <div className="flex justify-between text-[0.68rem] text-muted-foreground">
        <span>Walkable</span>
        <span>{DISTANCE_MAX} mi+</span>
      </div>
    </div>
  )
}
