from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.views import View
from django.views.generic import ListView
from .models import Listing

# 1. FBV (Manual HttpResponse)
def listing_manual_view(request):
    pass

# 2. FBV (render shortcut)
def listing_render_view(request):
    listings = Listing.objects.filter(status=Listing.Status.ACTIVE)
    return render(request, 'marketplace/listing_list.html', {'listings': listings})

# 3. Base CBV
class ListingBaseView(View):
    pass

# 4. Generic CBV
class ListingGenericView(ListView):
    pass