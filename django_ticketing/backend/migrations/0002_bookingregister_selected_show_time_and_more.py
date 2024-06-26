# Generated by Django 5.0.2 on 2024-04-16 09:49

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookingregister',
            name='selected_show_time',
            field=models.CharField(default='', max_length=10),
        ),
        migrations.AddField(
            model_name='bookingregister',
            name='show_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bookingregister',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default=180.0, max_digits=6),
        ),
        migrations.AddField(
            model_name='movie',
            name='trailer',
            field=models.URLField(default=django.utils.timezone.now, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='show_time',
            field=models.JSONField(max_length=50),
        ),
    ]
