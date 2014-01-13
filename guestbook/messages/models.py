from django.db import models

# Create your models here.

class Message(models.Model):
    image_url = models.URLField()
    comment = models.TextField()
