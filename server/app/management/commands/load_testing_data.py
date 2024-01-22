from django.core.management.base import BaseCommand, CommandError
from app.management.scripts.bootstrap import *

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        create_admin_user(username='admin', email='admin@local.com', password='admin123')
        load_sample_data()
