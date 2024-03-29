# Generated by Django 4.0.4 on 2022-05-16 03:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0011_route_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='description',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='ticket',
            name='seat_position',
            field=models.CharField(max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='tour',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='DetailTicket',
        ),
    ]
