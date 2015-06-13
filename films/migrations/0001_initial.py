# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Agent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('pic', models.ImageField(upload_to='films/agents/%Y/%m/%d')),
                ('imdb_link', models.URLField(default='#')),
                ('short_description', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Film',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('year', models.PositiveIntegerField()),
                ('country', models.CharField(max_length=50)),
                ('duration', models.PositiveIntegerField(default=0)),
                ('genre', models.CharField(max_length=150)),
                ('synopsis', models.TextField(max_length=700)),
                ('review', models.TextField(max_length=700)),
                ('language', models.CharField(max_length=50)),
                ('rate', models.FloatField(default=0)),
                ('pic', models.ImageField(upload_to='films/pics/%Y/%m/%d')),
                ('cover', models.ImageField(upload_to='films/covers/%Y/%m/%d')),
                ('imdb_link', models.URLField(default='#')),
            ],
        ),
        migrations.CreateModel(
            name='FilmAgent',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('relation', models.CharField(max_length=50)),
                ('role', models.CharField(max_length=100, blank=True)),
                ('agent', models.ForeignKey(related_name='films', to='films.Agent')),
                ('film', models.ForeignKey(to='films.Film')),
            ],
        ),
        migrations.AddField(
            model_name='film',
            name='agents',
            field=models.ManyToManyField(to='films.Agent', through='films.FilmAgent'),
        ),
        migrations.AddField(
            model_name='film',
            name='director',
            field=models.ForeignKey(related_name='directed_films', to='films.Agent'),
        ),
        migrations.AddField(
            model_name='film',
            name='writer',
            field=models.ManyToManyField(related_name='written_films', to='films.Agent'),
        ),
    ]
