import { ArrowRight } from "lucide-react"

const STEPS = [
  { title: "Choose a space", detail: "Pick the room you're furnishing." },
  { title: "Select at least three items", detail: "Mix and match curated finds." },
  { title: "See your bundle price", detail: "Save more the more you bundle." },
]

export function MoveInBundlePromo() {
  return (
    <div className="flex flex-col gap-0">
      <p className="text-center text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Move-In</p>
      <h1 className="mt-2 text-center text-balance font-serif text-4xl font-medium leading-[1.02] text-foreground sm:text-5xl">
        Bundle Builder
      </h1>
      <p className="mt-3 text-center font-serif text-lg italic text-muted-foreground">
        Fair prices. Curated finds. Your move.
      </p>

      <ol className="mt-0 w-[300px] self-center space-y-5 border-t border-border pt-[9px] text-left">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[14px] border border-border font-serif text-sm font-medium text-foreground">
              {index + 1}
            </span>
            <div className="pt-0.5">
              <p className="text-left text-sm font-medium text-foreground">{step.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="mt-7 inline-flex w-1/3 self-center items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Try it!
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
