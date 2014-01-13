from django.shortcuts import render
from django.views.generic.detail import DetailView

from .models import Message

class RandomMessageDetailView(DetailView):
    model = Message

    def get_object(self, queryset=None):
        if queryset is None:
            queryset = self.get_queryset()
        return queryset.order_by('?').first()
