# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('films', '0002_auto_20150610_1338'),
    ]

    operations = [
        migrations.RenameField(
            model_name='film',
            old_name='writer',
            new_name='writers',
        ),
    ]
