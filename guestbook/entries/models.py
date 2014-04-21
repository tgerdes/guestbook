from django.db import models


class Message(models.Model):
    image = models.ImageField(upload_to="images")
    comment = models.TextField()
    body = models.IntegerField(default=0, blank=True)
    hair = models.IntegerField(default=0, blank=True)
