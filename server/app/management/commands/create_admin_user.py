from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        admin_exists = User.objects.filter(username='admin').exists()
        if not admin_exists:
            User.objects.create_superuser('admin', 'admin@local.com', 'Admin123')
