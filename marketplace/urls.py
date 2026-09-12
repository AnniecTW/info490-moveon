from django.urls import path

from .views import (
    BaseListingView,
    GenericListingList,
    home,
    listings_api,
    manual_http_response,
    render_listing_summary,
)

urlpatterns = [
    path('', home, name='home'),
    path('api/listings/', listings_api, name='api_listings'),
    path('students/manual/', manual_http_response, name='manual_http_response'),
    path('students/render/', render_listing_summary, name='render_listing_summary'),
    path('students/cbv-base/', BaseListingView.as_view(), name='base_listing_view'),
    path('students/cbv-generic/', GenericListingList.as_view(), name='generic_listing_list'),
]
