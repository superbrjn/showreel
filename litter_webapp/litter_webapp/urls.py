"""litter_app URL Configuration"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
# dev only
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('microblog/', include('microblog.urls')),
    path('', RedirectView.as_view(url='/microblog/', permanent=True)),

    path('accounts/', include('django.contrib.auth.urls')), # auth
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
