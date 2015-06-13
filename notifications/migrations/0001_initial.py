# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField()),
                ('from_user', models.ForeignKey(related_name='sent_notification', to='users.CustomUser')),
                ('to_user', models.ForeignKey(related_name='received_notification', to='users.CustomUser')),
            ],
        ),
    ]
