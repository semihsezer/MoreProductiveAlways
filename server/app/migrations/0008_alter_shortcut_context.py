# Generated by Django 5.0.4 on 2024-10-20 07:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0007_ops_admin_permission"),
    ]

    operations = [
        migrations.AlterField(
            model_name="shortcut",
            name="context",
            field=models.CharField(
                db_index=True, default="", max_length=200, null=True
            ),
        ),
    ]