# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0001_initial'),
        ('users', '0001_initial'),
        ('films', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='author',
            field=models.ForeignKey(related_name='posts', to='users.CustomUser'),
        ),
        migrations.AddField(
            model_name='post',
            name='film',
            field=models.ForeignKey(related_name='posts', to='films.Film'),
        ),
        migrations.AddField(
            model_name='post',
            name='liked_users',
            field=models.ManyToManyField(related_name='liked_posts', to='users.CustomUser'),
        ),
    ]
