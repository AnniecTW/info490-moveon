from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.generic import ListView

from .models import Listing


def home(request):
    return HttpResponse("MoveOn homepage")


def manual_http_response(request):
    """Manual Django FBV returning raw HTML."""
    listings = Listing.objects.select_related("seller", "item_type", "item_type__category").order_by("-created_at")[:5]
    rows = "".join(
        f"<li><strong>{listing.title}</strong> — ${listing.listing_price}</li>" for listing in listings
    )
    html = f"<h1>Manual HttpResponse View</h1><ul>{rows}</ul>"
    return HttpResponse(html)


def render_listing_summary(request):
    """Shortcut FBV that renders a template with a queryset in context."""
    listings = Listing.objects.select_related("seller", "item_type", "item_type__category").order_by("-created_at")
    return render(request, "marketplace/render_listing_summary.html", {"listings": listings})


class BaseListingView(View):
    """Base View CBV that manually handles a queryset and renders a template."""

    def get(self, request, *args, **kwargs):
        listings = Listing.objects.select_related("seller", "item_type", "item_type__category").order_by("-created_at")
        return render(request, "marketplace/base_listing_view.html", {"listings": listings})


class GenericListingList(ListView):
    """Generic ListView CBV using the Listing model."""

    model = Listing
    template_name = "marketplace/generic_listing_list.html"
    context_object_name = "listings"
    queryset = Listing.objects.select_related("seller", "item_type", "item_type__category").order_by("-created_at")


def listings_api(request):
    items = []
    for listing in Listing.objects.select_related("seller", "item_type", "item_type__category").all():
        category_name = listing.item_type.category.category_name
        item_type_name = listing.item_type.item_type_name
        condition_label = listing.get_condition_display()
        if condition_label == "Like New":
            condition_value = "Like New"
        else:
            condition_value = condition_label.title()

        data = {
            "id": str(listing.pk),
            "itemName": listing.item_type.item_type_name,
            "title": listing.title,
            "imageUrl": (
                request.build_absolute_uri(listing.image.url)
                if listing.image
                else ""
            ),
            "originalPrice": float(listing.retail_price or 0),
            "salePrice": float(listing.listing_price or 0),
            "datePosted": listing.created_at.strftime("%b %d").replace(" 0", " "),
            "seller": {
                "id": str(listing.seller_id),
                "name": listing.seller.display_name,
            },
            "condition": condition_value,
            "category": category_name,
            "itemType": item_type_name,
            "space": None,
            "bundleEligible": bool(listing.bundle_eligible),
            "distanceMiles": None,
            "deliveryOptions": [],
            "isSaved": False,
        }
        items.append(data)

    return JsonResponse(items, safe=False)
