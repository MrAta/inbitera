# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('notifications', '0005_notification_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='to_user',
            field=models.ForeignKey(related_name='received_notifications', default=None, to='users.CustomUser'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='notification',
            name='post',
            field=models.ForeignKey(related_name='notifications', to='posts.Post', null=True),
        ),
    ]
