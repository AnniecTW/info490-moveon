from django.test import TestCase
from django.urls import reverse

from .models import ItemCategory, ItemType, Listing, User


class RequiredViewRoutesTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="seller1",
            email="seller1@example.com",
            password="secret123",
            display_name="Seller One",
        )
        category = ItemCategory.objects.create(category_name="Furniture")
        item_type = ItemType.objects.create(category=category, item_type_name="Chair")
        Listing.objects.create(
            seller=self.user,
            item_type=item_type,
            title="Coding Chair",
            description="A chair for study sessions.",
            image_url="",
            condition=Listing.Condition.GOOD,
            listing_price=45,
            retail_price=60,
            fulfillment_option=Listing.Fulfillment.EITHER,
        )

    def test_required_view_urls_are_live(self):
        valid_names = [
            "manual_http_response",
            "render_listing_summary",
            "base_listing_view",
            "generic_listing_list",
        ]

        for name in valid_names:
            response = self.client.get(reverse(name))
            self.assertEqual(response.status_code, 200, f"{name} should return HTTP 200")
