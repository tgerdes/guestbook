from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

from guestbook.messages.views import RandomMessageDetailView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'guestbook.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^random', RandomMessageDetailView.as_view(), name="random-message"),

    url(r'^admin/', include(admin.site.urls)),
)
