# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Message'
        db.create_table(u'entries_message', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('image_url', self.gf('django.db.models.fields.URLField')(max_length=200)),
            ('comment', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'entries', ['Message'])


    def backwards(self, orm):
        # Deleting model 'Message'
        db.delete_table(u'entries_message')


    models = {
        u'entries.message': {
            'Meta': {'object_name': 'Message'},
            'comment': ('django.db.models.fields.TextField', [], {}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'image_url': ('django.db.models.fields.URLField', [], {'max_length': '200'})
        }
    }

    complete_apps = ['entries']