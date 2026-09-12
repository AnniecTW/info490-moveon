export type Condition = "Like New" | "Excellent" | "Good" | "Fair"

export type Category =
  | "Furniture"
  | "Home & Decor"
  | "Electronics"
  | "Kitchen"
  | "Bedding"
  | "Appliances"
  | "Textbooks"

export type Space =
  | "Bedroom"
  | "Living Room"
  | "Kitchen"
  | "Bathroom"
  | "Study / Office"
  | "Dining"

export type DeliveryOption =
  | "Public Meetup"
  | "Pickup at Seller's Place"
  | "Flexible"

export type SortOption =
  | "Popular"
  | "Recommended For You"
  | "Newest to Oldest"
  | "Oldest to New"

export interface Seller {
  id: string
  name: string
  avatarUrl?: string
}

export interface Listing {
  id: string
  itemName: string
  title: string
  imageUrl: string
  originalPrice: number
  salePrice: number
  datePosted: string
  seller: Seller
  condition: Condition
  category: Category
  itemType: string
  space: Space
  bundleEligible: boolean
  distanceMiles: number
  deliveryOptions: DeliveryOption[]
  isSaved?: boolean
}

/** A price annotation pinned over a featured-bundle room image. */
export interface BundleItem {
  listingId: string
  itemName: string
  imageUrl?: string
  originalPrice: number
  discountedPrice: number
  /** Optional position (percent 0-100) for a code-rendered annotation. */
  x?: number
  y?: number
}

export interface FeaturedBundle {
  id: string
  title: string
  imageUrl: string
  /** True when price annotations are already baked into the image. */
  annotationsInImage?: boolean
  items: BundleItem[]
  totalOriginalPrice: number
  totalDiscountedPrice: number
  totalSaved: number
  overallDiscountPercent: number
}

export interface MarketplaceFilters {
  categories: Category[]
  itemTypes: string[]
  minPrice: number
  maxPrice: number
  conditions: Condition[]
  bundleEligibleOnly: boolean
  spaces: Space[]
  distanceRadiusMiles: number
  deliveryOptions: DeliveryOption[]
  sort: SortOption
}
