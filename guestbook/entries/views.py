from django.http import HttpResponse
from django.views.generic import View, DetailView, TemplateView
from django.conf import settings
from uuid import uuid1

from dropbox.client import DropboxClient

from .models import Message

class RandomMessageDetailView(DetailView):
    model = Message

    def get_object(self, queryset=None):
        if queryset is None:
            queryset = self.get_queryset()
        return queryset.order_by('?').first()


class HomeView(TemplateView):
    template_name = "home.html"


class UploadView(View):
    def post(self, request):
        client = DropboxClient(settings.DROPBOX_ACCESS_TOKEN)
        p = "{}{}.png".format(settings.DROPBOX_PATH, str(uuid1()))
        client.put_file(p, request.FILES['image'])
        share_url = client.share(p, short_url=False)['url'] + "?dl=1"
        Message.objects.create(image_url=share_url,
                               comment=request.POST['comment'])
        return HttpResponse("")
