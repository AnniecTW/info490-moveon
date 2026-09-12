from django.http import HttpResponse
from django.shortcuts import render
from django.template import loader
from django.views import View
from django.views.generic import ListView
from .models import Listing

# 1. FBV (Manual HttpResponse)
def listing_manual_view(request):
    listings = Listing.objects.filter(status=Listing.Status.ACTIVE)
    template = loader.get_template('marketplace/listing_list.html')
    return HttpResponse(template.render({'listings': listings}, request))

# 2. FBV (render shortcut)
def listing_render_view(request):
    listings = Listing.objects.filter(status=Listing.Status.ACTIVE)
    return render(request, 'marketplace/listing_list.html', {'listings': listings})

# 3. Base CBV
class ListingBaseView(View):
    def get(self, request):
        listings = Listing.objects.filter(status=Listing.Status.ACTIVE)
        return render(request, 'marketplace/listing_list.html', {'listings': listings})

# 4. Generic CBV
class ListingGenericView(ListView):
    model = Listing
    template_name = 'marketplace/listing_list.html'
    context_object_name = 'listings'

    def get_queryset(self):
        return Listing.objects.filter(status=Listing.Status.ACTIVE)
