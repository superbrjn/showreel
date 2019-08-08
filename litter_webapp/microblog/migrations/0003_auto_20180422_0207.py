# Generated by Django 2.0.2 on 2018-04-21 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('microblog', '0002_auto_20180421_2201'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='active'),
        ),
        migrations.AddField(
            model_name='user',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='is_staff',
            field=models.BooleanField(default=False),
        ),
    ]
