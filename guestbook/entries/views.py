import json
from django.conf import settings
from django.forms import ModelForm
from django.http import HttpResponse
from django.views.generic import View, DetailView, TemplateView

from .models import Message

class MessageForm(ModelForm):
    class Meta:
        model = Message


class RandomMessageDetailView(DetailView):
    model = Message

    def get_object(self, queryset=None):
        if queryset is None:
            queryset = self.get_queryset()
        return queryset.order_by('?').first()


class HomeView(TemplateView):
    template_name = "home.html"


class GuestsView(View):
    def get(self, request):
        messages = Message.objects.all()
        data = [{'comment': message.comment,
                 'body': message.body,
                 'hair': message.hair,
                 'image': message.thumb.url,
                 'full_image': message.image.url,
                } for message in messages]
        return HttpResponse(json.dumps(data),
                            content_type='application/json')


class UploadView(View):
    def post(self, request):
        form = MessageForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
        return HttpResponse("")
