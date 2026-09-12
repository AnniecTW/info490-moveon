import { Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export function BundleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-[0.68rem] font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm ring-1 ring-border",
        className,
      )}
    >
      <Layers className="h-3 w-3" aria-hidden="true" />
      Bundle Eligible
    </span>
  )
}
