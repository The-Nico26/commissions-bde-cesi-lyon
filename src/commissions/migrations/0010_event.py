# Generated by Django 2.2.5 on 2019-09-27 08:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('commissions', '0009_auto_20190924_1642'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('slug', models.SlugField(blank=True, unique=True)),
                ('description', models.TextField()),
                ('short_desc', models.CharField(max_length=60)),
                ('banner', models.ImageField(upload_to='events/photos')),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('update_date', models.DateTimeField(auto_now=True)),
                ('event_date_start', models.DateTimeField()),
                ('event_date_end', models.DateTimeField()),
                ('commission', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='commission', to='commissions.Commission')),
            ],
        ),
    ]
