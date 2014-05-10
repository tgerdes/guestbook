from django.contrib import admin
from django.utils.safestring import mark_safe
from django.conf import settings

from .models import Message

# Register your models here.


class MessageAdmin(admin.ModelAdmin):
    list_display = ('image_thumb', 'comment')

    def image_thumb(self, obj):
        return mark_safe('<img src="{}{}"/>'.format(settings.MEDIA_URL,
                                                    obj.thumb))



admin.site.register(Message, MessageAdmin)
