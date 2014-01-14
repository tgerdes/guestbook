from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from guestbook.entries.views import RandomMessageDetailView, HomeView, UploadView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'guestbook.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^$', HomeView.as_view(), name="home"),
    url(r'^random', RandomMessageDetailView.as_view(), name="random-message"),
    url(r'^upload', UploadView.as_view(), name="upload"),

    url(r'^admin/', include(admin.site.urls)),
)
