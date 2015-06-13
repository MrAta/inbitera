# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notifications', '0003_auto_20150612_1959'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='comment',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='to_user',
        ),
        migrations.AlterField(
            model_name='notification',
            name='post',
            field=models.ForeignKey(related_name='notifications', to='posts.Post'),
        ),
    ]
