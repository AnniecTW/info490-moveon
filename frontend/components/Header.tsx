"use client"

import { Mail, ShoppingBag, Tag, User } from "lucide-react"
import { Logo } from "@/components/Logo"
import { SearchBar } from "@/components/SearchBar"

interface HeaderProps {
  search: string
  onSearchChange: (value: string) => void
  savedCount: number
}

function IconButton({
  label,
  children,
  badge,
}: {
  label: string
  children: React.ReactNode
  badge?: number
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-semibold text-gold-foreground">
          {badge}
        </span>
      ) : null}
    </button>
  )
}

export function Header({ search, onSearchChange, savedCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6 md:px-6 md:py-4">
        <div className="flex items-center justify-between md:justify-start">
          <Logo />
          <div className="flex items-center gap-1 md:hidden">
            <IconButton label="Saved items" badge={savedCount || undefined}>
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
            <IconButton label="Account">
              <User className="h-5 w-5" />
            </IconButton>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-3 md:gap-5">
          <SearchBar value={search} onChange={onSearchChange} className="flex-1" />

          <button
            type="button"
            className="hidden shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex"
          >
            <Tag className="h-4 w-4" />
            Sell Item
          </button>

          <div className="hidden items-center gap-1 md:flex">
            <IconButton label="Messages">
              <Mail className="h-5 w-5" />
            </IconButton>
            <IconButton label="Saved items" badge={savedCount || undefined}>
              <ShoppingBag className="h-5 w-5" />
            </IconButton>
            <IconButton label="Account">
              <User className="h-5 w-5" />
            </IconButton>
          </div>
        </div>
      </div>
    </header>
  )
}
