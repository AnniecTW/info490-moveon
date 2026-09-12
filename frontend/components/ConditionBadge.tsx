import { cn } from "@/lib/utils"
import type { Condition } from "@/types/marketplace"

export function ConditionBadge({ condition, className }: { condition: Condition; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card px-2.5 py-0.5 text-[0.7rem] font-medium tracking-wide text-muted-foreground",
        className,
      )}
    >
      {condition}
    </span>
  )
}
