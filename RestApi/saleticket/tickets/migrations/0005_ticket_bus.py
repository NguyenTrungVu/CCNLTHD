# Generated by Django 4.0.4 on 2022-05-06 08:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tickets', '0004_alter_tour_arrived_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='ticket',
            name='bus',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='tickets.bus'),
        ),
    ]
