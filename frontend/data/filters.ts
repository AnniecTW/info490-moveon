import type {
  Category,
  Condition,
  DeliveryOption,
  MarketplaceFilters,
  SortOption,
  Space,
} from "@/types/marketplace"

export const CATEGORIES: Category[] = [
  "Furniture",
  "Home & Decor",
  "Electronics",
  "Kitchen",
  "Bedding",
  "Appliances",
  "Textbooks",
]

export const CONDITIONS: Condition[] = ["Like New", "Excellent", "Good", "Fair"]

export const SPACES: Space[] = [
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Bathroom",
  "Study / Office",
  "Dining",
]

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  "Public Meetup",
  "Pickup at Seller's Place",
  "Flexible",
]

export const SORT_OPTIONS: SortOption[] = [
  "Popular",
  "Recommended For You",
  "Newest to Oldest",
  "Oldest to New",
]

export const ITEM_TYPES_BY_CATEGORY: Record<Category, string[]> = {
  Furniture: ["Chair", "Table", "Desk", "Sofa", "Shelf", "Dresser"],
  "Home & Decor": ["Pillow", "Lamp", "Rug", "Wall Art", "Mirror"],
  Electronics: ["Monitor", "Speaker", "Charger", "Router"],
  Kitchen: ["Cookware", "Utensils", "Kettle", "Blender"],
  Bedding: ["Comforter", "Sheets", "Mattress Topper", "Blanket"],
  Appliances: ["Mini Fridge", "Microwave", "Fan", "Vacuum"],
  Textbooks: ["Math", "Science", "Humanities", "Business"],
}

export const PRICE_MIN = 0
export const PRICE_MAX = 200
export const DISTANCE_MIN = 0
export const DISTANCE_MAX = 25

export const defaultFilters: MarketplaceFilters = {
  categories: [],
  itemTypes: [],
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  conditions: [],
  bundleEligibleOnly: false,
  spaces: [],
  distanceRadiusMiles: DISTANCE_MAX,
  deliveryOptions: [],
  sort: "Popular",
}
