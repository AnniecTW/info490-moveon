import { cn } from "@/lib/utils"
import { discountPercent } from "@/lib/marketplace-utils"

interface PriceDisplayProps {
  originalPrice: number
  salePrice: number
  showSavings?: boolean
  className?: string
  size?: "sm" | "md"
}

export function PriceDisplay({
  originalPrice,
  salePrice,
  showSavings = true,
  className,
  size = "md",
}: PriceDisplayProps) {
  const percent = discountPercent(originalPrice, salePrice)
  const hasDiscount = salePrice < originalPrice

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "font-serif font-semibold tracking-tight text-foreground",
          size === "md" ? "text-xl" : "text-lg",
        )}
      >
        ${salePrice}
      </span>
      {hasDiscount && (
        <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/60">
          ${originalPrice}
        </span>
      )}
      {hasDiscount && showSavings && (
        <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[0.68rem] font-medium tracking-wide text-gold-foreground">
          Save {percent}%
        </span>
      )}
    </div>
  )
}
