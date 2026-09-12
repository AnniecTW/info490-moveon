import type { FeaturedBundle } from "@/types/marketplace"

export const featuredBundles: FeaturedBundle[] = [
  {
    id: "living-room-starter",
    title: "Living Room Starter Bundle",
    imageUrl: "/images/living-room-clean.png",
    annotationsInImage: false,
    items: [
      { listingId: "rocking-chair-001", itemName: "Rocking Chair", originalPrice: 140, discountedPrice: 95, x: 82, y: 60 },
      { listingId: "coffee-table-001", itemName: "Coffee Table", originalPrice: 55, discountedPrice: 40, x: 47, y: 82 },
      { listingId: "gray-pillow-001", itemName: "Throw Pillow", originalPrice: 18, discountedPrice: 12, x: 12, y: 56 },
      { listingId: "blue-pillow-001", itemName: "Accent Pillow", originalPrice: 20, discountedPrice: 14, x: 27, y: 64 },
    ],
    totalOriginalPrice: 233,
    totalDiscountedPrice: 161,
    totalSaved: 72,
    overallDiscountPercent: 30.9,
  },
  {
    id: "study-nook",
    title: "Study Nook Bundle",
    imageUrl: "/images/study-bundle.png",
    annotationsInImage: false,
    items: [
      { listingId: "oak-desk-002", itemName: "Oak Desk", originalPrice: 90, discountedPrice: 60, x: 38, y: 64 },
      { listingId: "wishbone-chair-002", itemName: "Wishbone Chair", originalPrice: 72, discountedPrice: 48, x: 49, y: 82 },
      { listingId: "desk-lamp-002", itemName: "Desk Lamp", originalPrice: 34, discountedPrice: 22, x: 30, y: 48 },
      { listingId: "bookshelf-002", itemName: "Bookshelf", originalPrice: 68, discountedPrice: 45, x: 75, y: 72 },
    ],
    totalOriginalPrice: 264,
    totalDiscountedPrice: 175,
    totalSaved: 89,
    overallDiscountPercent: 33.7,
  },
]
