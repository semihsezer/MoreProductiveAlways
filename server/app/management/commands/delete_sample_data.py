from django.core.management.base import BaseCommand, CommandError
from app.management.scripts.bootstrap import *

class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        delete_sample_data()
