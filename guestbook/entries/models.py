from django.db import models

from django.contrib.staticfiles.storage import ManifestStaticFilesStorage


class Message(models.Model):
    image = models.ImageField(upload_to="images")
    thumb = models.ImageField(upload_to="images")
    comment = models.TextField()
    body = models.IntegerField(default=0, blank=True)
    hair = models.IntegerField(default=0, blank=True)

    def __unicode__(self):
        return u"<Message: {}>".format(self.comment)


class CustomStaticFilesStorage(ManifestStaticFilesStorage):
    patterns = ()
