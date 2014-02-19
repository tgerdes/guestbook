from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

from django.contrib import admin
admin.autodiscover()

from guestbook.entries.views import (
    RandomMessageDetailView,
    HomeView,
    UploadView
)

urlpatterns = patterns('',  # noqa
    url(r'^$', HomeView.as_view(), name="home"),
    url(r'^random/', RandomMessageDetailView.as_view(), name="random-message"),
    url(r'^upload/', UploadView.as_view(), name="upload"),
    url(r'^game/', TemplateView.as_view(
        template_name="game.html"), name="game"
    ),
    url(r'^admin/', include(admin.site.urls)),
)
