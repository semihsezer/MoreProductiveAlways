# Generated by Django 5.0.4 on 2024-10-23 10:26

import shortuuid.django_fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Config",
            fields=[
                (
                    "id",
                    shortuuid.django_fields.ShortUUIDField(
                        alphabet=None,
                        editable=False,
                        length=22,
                        max_length=22,
                        prefix="",
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("key", models.CharField(db_index=True, max_length=200, unique=True)),
                ("value", models.CharField(blank=True, max_length=200)),
                ("description", models.CharField(blank=True, max_length=200)),
            ],
            options={
                "abstract": False,
            },
        ),
    ]