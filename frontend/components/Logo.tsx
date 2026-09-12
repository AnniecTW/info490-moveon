import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <a href="/" className={cn("group inline-flex flex-col leading-none", className)} aria-label="MoveOn home">
      <span className="inline-flex items-baseline font-serif text-[1.75rem] font-medium tracking-tight text-primary">
        <span>Move</span>
        <span className="italic text-wood">On</span>
        <span aria-hidden="true" className="ml-0.5 h-1.5 w-1.5 self-end rounded-full bg-wood" />
      </span>
      <span className="mt-1.5 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        A fresh start at a fair price
      </span>
    </a>
  )
}
