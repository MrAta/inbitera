# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0003_auto_20150611_1034'),
        ('comments', '0004_auto_20150611_1519'),
        ('notifications', '0002_auto_20150612_1841'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='comment',
            field=models.ForeignKey(default=None, to='comments.Comment'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='notification',
            name='post',
            field=models.ForeignKey(default=None, to='posts.Post'),
            preserve_default=False,
        ),
    ]
