from decimal import Decimal
from pathlib import Path

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management.base import BaseCommand
from django.db import transaction

from marketplace.models import ItemCategory, ItemType, Listing

User = get_user_model()


def money(value):
    return Decimal(str(value)).quantize(Decimal("0.01"))


CONDITION_MAP = {
    "Excellent": Listing.Condition.LIKE_NEW,
    "Like New": Listing.Condition.LIKE_NEW,
    "Good": Listing.Condition.GOOD,
    "Fair": Listing.Condition.FAIR,
    "Poor": Listing.Condition.POOR,
}

UNSUPPORTED_V0_FIELDS = {"space", "distanceMiles", "deliveryOptions"}


V0_LISTINGS = [
    {
        "id": "rocking-chair-001",
        "itemName": "Rocking Chair",
        "title": "Scandinavian Bentwood Rocking Chair",
        "imageUrl": "/images/rocking-chair.png",
        "originalPrice": 140,
        "salePrice": 95,
        "seller": {"id": "seller-maya", "name": "Maya R."},
        "condition": "Excellent",
        "category": "Furniture",
        "itemType": "Chair",
        "bundleEligible": True,
    },
    {
        "id": "coffee-table-001",
        "itemName": "Coffee Table",
        "title": "Minimal Oak & White Coffee Table",
        "imageUrl": "/images/coffee-table.png",
        "originalPrice": 55,
        "salePrice": 40,
        "seller": {"id": "seller-alex", "name": "Alex T."},
        "condition": "Good",
        "category": "Furniture",
        "itemType": "Table",
        "bundleEligible": True,
    },
    {
        "id": "gray-pillow-001",
        "itemName": "Throw Pillow",
        "title": "Gray Botanical Throw Pillow",
        "imageUrl": "/images/gray-pillow.png",
        "originalPrice": 18,
        "salePrice": 12,
        "seller": {"id": "seller-emma", "name": "Emma L."},
        "condition": "Like New",
        "category": "Home & Decor",
        "itemType": "Pillow",
        "bundleEligible": True,
    },
    {
        "id": "blue-pillow-001",
        "itemName": "Throw Pillow",
        "title": "Blue Floral Accent Pillow",
        "imageUrl": "/images/blue-pillow.png",
        "originalPrice": 20,
        "salePrice": 14,
        "seller": {"id": "seller-jordan", "name": "Jordan K."},
        "condition": "Excellent",
        "category": "Home & Decor",
        "itemType": "Pillow",
        "bundleEligible": True,
    },
    {
        "id": "pillow-pair-001",
        "itemName": "Throw Pillow Set",
        "title": "Pair of Patterned Throw Pillows",
        "imageUrl": "/images/pillows-pair.png",
        "originalPrice": 34,
        "salePrice": 24,
        "seller": {"id": "seller-emma", "name": "Emma L."},
        "condition": "Like New",
        "category": "Home & Decor",
        "itemType": "Pillow",
        "bundleEligible": True,
    },
    {
        "id": "jute-rug-001",
        "itemName": "Area Rug",
        "title": "Handwoven Jute Area Rug",
        "imageUrl": "/images/jute-rug.png",
        "originalPrice": 85,
        "salePrice": 58,
        "seller": {"id": "seller-alex", "name": "Alex T."},
        "condition": "Good",
        "category": "Home & Decor",
        "itemType": "Rug",
        "bundleEligible": True,
    },
    {
        "id": "side-table-001",
        "itemName": "Side Table",
        "title": "Sage Metal Round Side Table",
        "imageUrl": "/images/side-table.png",
        "originalPrice": 48,
        "salePrice": 32,
        "seller": {"id": "seller-noah", "name": "Noah P."},
        "condition": "Excellent",
        "category": "Furniture",
        "itemType": "Table",
        "bundleEligible": True,
    },
    {
        "id": "oak-desk-002",
        "itemName": "Desk",
        "title": "Solid Oak Writing Desk",
        "imageUrl": "/images/oak-desk.png",
        "originalPrice": 90,
        "salePrice": 60,
        "seller": {"id": "seller-sofia", "name": "Sofia M."},
        "condition": "Excellent",
        "category": "Furniture",
        "itemType": "Desk",
        "bundleEligible": True,
    },
    {
        "id": "wishbone-chair-002",
        "itemName": "Dining Chair",
        "title": "Woven Wishbone Oak Chair",
        "imageUrl": "/images/wishbone-chair.png",
        "originalPrice": 72,
        "salePrice": 48,
        "seller": {"id": "seller-sofia", "name": "Sofia M."},
        "condition": "Good",
        "category": "Furniture",
        "itemType": "Chair",
        "bundleEligible": True,
    },
    {
        "id": "desk-lamp-002",
        "itemName": "Desk Lamp",
        "title": "Brass Articulating Task Lamp",
        "imageUrl": "/images/desk-lamp.png",
        "originalPrice": 34,
        "salePrice": 22,
        "seller": {"id": "seller-liam", "name": "Liam D."},
        "condition": "Like New",
        "category": "Home & Decor",
        "itemType": "Lamp",
        "bundleEligible": True,
    },
    {
        "id": "bookshelf-002",
        "itemName": "Bookshelf",
        "title": "Oak Two-Tier Open Bookshelf",
        "imageUrl": "/images/bookshelf.png",
        "originalPrice": 68,
        "salePrice": 45,
        "seller": {"id": "seller-liam", "name": "Liam D."},
        "condition": "Good",
        "category": "Furniture",
        "itemType": "Shelf",
        "bundleEligible": True,
    },
]


class Command(BaseCommand):
    help = "Seed the polished V0 marketplace dataset into real Django rows and media files."

    def handle(self, *args, **options):
        with transaction.atomic():
            created_users = self._seed_users()
            category_map, item_type_map = self._seed_taxonomy()
            self._seed_listings(created_users, category_map, item_type_map)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {User.objects.count()} users and {Listing.objects.count()} listings from the V0 dataset."
            )
        )

    def _seed_users(self):
        users = {}
        for item in V0_LISTINGS:
            seller = item["seller"]
            username = seller["id"]
            display_name = seller["name"].strip()
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": f"{username}@illinois.edu",
                    "display_name": display_name,
                    "email_verified": True,
                },
            )
            if created:
                user.set_password("password123")
                user.save()
            users[username] = user
        return users

    def _seed_taxonomy(self):
        category_map = {}
        item_type_map = {}

        for item in V0_LISTINGS:
            category_name = item["category"].strip()
            item_type_name = item["itemType"].strip()

            category, _ = ItemCategory.objects.get_or_create(category_name=category_name)
            category_map[(category_name, item_type_name)] = category

            item_type, _ = ItemType.objects.get_or_create(
                category=category,
                item_type_name=item_type_name,
            )
            item_type_map[(category_name, item_type_name)] = item_type

        return category_map, item_type_map

    def _seed_listings(self, users, category_map, item_type_map):
        for item in V0_LISTINGS:
            ignored_fields = sorted(set(item) & UNSUPPORTED_V0_FIELDS)
            if ignored_fields:
                self.stdout.write(
                    self.style.WARNING(
                        f"Ignoring unsupported V0 listing fields for '{item['title']}': {ignored_fields}"
                    )
                )

            seller = item["seller"]
            user = users[seller["id"]]
            category_name = item["category"].strip()
            item_type_name = item["itemType"].strip()
            item_type = item_type_map[(category_name, item_type_name)]

            filename = Path(item["imageUrl"]).name
            asset_path = settings.BASE_DIR / "frontend" / "public" / "images" / filename

            listing, created = Listing.objects.get_or_create(
                title=item["title"],
                seller=user,
                defaults={
                    "item_type": item_type,
                    "description": f"{item['itemName']} from the V0 marketplace dataset.",
                    "image_url": "",
                    "condition": CONDITION_MAP.get(item["condition"], Listing.Condition.GOOD),
                    "listing_price": money(item["salePrice"]),
                    "retail_price": money(item["originalPrice"]),
                    "benchmark_price": money(item["originalPrice"]),
                    "benchmark_low": money(item["originalPrice"] * 0.85),
                    "benchmark_high": money(item["originalPrice"] * 1.15),
                    "bundle_eligible": bool(item.get("bundleEligible", False)),
                    "fulfillment_option": Listing.Fulfillment.EITHER,
                    "status": Listing.Status.ACTIVE,
                },
            )

            if not created:
                listing.item_type = item_type
                listing.description = f"{item['itemName']} from the V0 marketplace dataset."
                listing.condition = CONDITION_MAP.get(item["condition"], Listing.Condition.GOOD)
                listing.listing_price = money(item["salePrice"])
                listing.retail_price = money(item["originalPrice"])
                listing.benchmark_price = money(item["originalPrice"])
                listing.benchmark_low = money(item["originalPrice"] * 0.85)
                listing.benchmark_high = money(item["originalPrice"] * 1.15)
                listing.bundle_eligible = bool(item.get("bundleEligible", False))
                listing.fulfillment_option = Listing.Fulfillment.EITHER
                listing.status = Listing.Status.ACTIVE
                listing.save()

            if asset_path.exists():
                with asset_path.open("rb") as image_file:
                    listing.image.save(filename, File(image_file), save=True)

            self.stdout.write(
                self.style.SUCCESS(f"{listing.title} -> {listing.image}")
            )
