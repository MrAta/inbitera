# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agent',
            name='imdb_link',
            field=models.URLField(default='http://en.wikipedia.org/wiki/'),
        ),
        migrations.AlterField(
            model_name='film',
            name='imdb_link',
            field=models.URLField(default='http://en.wikipedia.org/wiki/'),
        ),
    ]
