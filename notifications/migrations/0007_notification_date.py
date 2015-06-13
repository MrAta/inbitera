# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0006_auto_20150612_2026'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='date',
            field=models.CharField(default=None, max_length=50),
            preserve_default=False,
        ),
    ]
