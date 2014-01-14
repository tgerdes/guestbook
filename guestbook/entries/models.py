from django.db import models


class Message(models.Model):
    image_url = models.URLField()
    comment = models.TextField()
