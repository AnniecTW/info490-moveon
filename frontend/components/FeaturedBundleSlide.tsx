import Image from "next/image"
import type { FeaturedBundle } from "@/types/marketplace"
import { BundleSummary } from "@/components/BundleSummary"

const TEXT_HALO = {
  textShadow: "0 1px 5px rgba(252,251,248,0.95), 0 0 2px rgba(252,251,248,0.95)",
}

function PriceAnnotation({
  itemName,
  originalPrice,
  discountedPrice,
  x = 50,
  y = 50,
}: {
  itemName: string
  originalPrice: number
  discountedPrice: number
  x?: number
  y?: number
}) {
  return (
    <div
      className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className="marker-font text-sm leading-none text-pencil-red line-through decoration-pencil-red/70"
        style={TEXT_HALO}
      >
        ${originalPrice}
      </span>
      <span
        className="marker-font -mt-0.5 text-2xl font-bold leading-none text-primary"
        style={TEXT_HALO}
      >
        ${discountedPrice}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 48 8"
        className="mt-0.5 h-1.5 w-11 text-wood"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="M2 5 C 12 2, 22 7, 32 4 S 44 3, 46 5" />
      </svg>
      <span className="sr-only">
        {itemName}: was ${originalPrice}, now ${discountedPrice}
      </span>
    </div>
  )
}

export function FeaturedBundleSlide({ bundle }: { bundle: FeaturedBundle }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-secondary">
      <Image
        src={bundle.imageUrl || "/placeholder.svg"}
        alt={`${bundle.title} — a curated room of resale items`}
        fill
        sizes="(min-width:1024px) 60vw, 90vw"
        className="object-cover"
        priority
      />

      {!bundle.annotationsInImage &&
        bundle.items.map((item) => (
          <PriceAnnotation
            key={item.listingId}
            itemName={item.itemName}
            originalPrice={item.originalPrice}
            discountedPrice={item.discountedPrice}
            x={item.x}
            y={item.y}
          />
        ))}

      <div className="absolute left-4 top-4 rounded-full bg-card/85 px-3 py-1 text-xs font-medium tracking-wide text-foreground shadow-sm ring-1 ring-border backdrop-blur-sm">
        {bundle.title}
      </div>

      <BundleSummary bundle={bundle} className="absolute right-4 top-4 hidden sm:block" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:hidden">
        <BundleSummary bundle={bundle} className="w-full" />
      </div>
    </div>
  )
}
