import { cn } from "@/lib/utils"
import type { FeaturedBundle } from "@/types/marketplace"

export function BundleSummary({ bundle, className }: { bundle: FeaturedBundle; className?: string }) {
  return (
    <div
      className={cn(
        "w-56 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-lg backdrop-blur-xl",
        className,
      )}
    >
      <dl className="space-y-2 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">Bundle price</dt>
          <dd className="font-serif text-lg font-semibold text-foreground">
            ${bundle.totalDiscountedPrice}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-muted-foreground">You save</dt>
          <dd className="font-medium text-foreground">${bundle.totalSaved}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2 border-t border-border/70 pt-2">
          <dt className="text-muted-foreground">Overall discount</dt>
          <dd>
            <span className="rounded-full bg-wood/15 px-2 py-0.5 text-xs font-semibold text-wood">
              {bundle.overallDiscountPercent}% off
            </span>
          </dd>
        </div>
      </dl>
    </div>
  )
}
