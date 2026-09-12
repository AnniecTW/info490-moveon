"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FeaturedBundle } from "@/types/marketplace"
import { FeaturedBundleSlide } from "@/components/FeaturedBundleSlide"

const AUTOPLAY_MS = 6000

export function FeaturedBundleCarousel({ bundles }: { bundles: FeaturedBundle[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = bundles.length

  const go = useCallback(
    (next: number) => setActive((current) => (next + count) % count),
    [count],
  )

  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (paused || count <= 1) return
    timer.current = setInterval(() => setActive((c) => (c + 1) % count), AUTOPLAY_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused, count])

  return (
    <section aria-label="Featured bundles" aria-roledescription="carousel">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-lg font-medium text-foreground">Featured Bundles</h2>
        {count > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous bundle"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next bundle"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              className="w-full shrink-0"
              aria-hidden={index !== active}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}: ${bundle.title}`}
            >
              <FeaturedBundleSlide bundle={bundle} />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {bundles.map((bundle, index) => (
            <button
              key={bundle.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to ${bundle.title}`}
              aria-current={index === active}
              className={cn(
                "h-2 rounded-full transition-all",
                index === active ? "w-6 bg-foreground" : "w-2 bg-border hover:bg-muted-foreground/50",
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
