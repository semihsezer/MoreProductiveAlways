# Create a RunPython migration to create the user group called ops_admin

from django.db import migrations
from django.contrib.auth.models import Group


def create_ops_admin_group(apps, schema_editor):
    Group.objects.get_or_create(name="ops_admin")


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0006_shortcut_context"),
    ]

    operations = [
        migrations.RunPython(create_ops_admin_group),
    ]
