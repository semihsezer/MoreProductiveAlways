from django.core.management.base import BaseCommand, CommandError
from app.management.scripts.bootstrap import *

class Command(BaseCommand):
    help = "Creates admin user if it doesn't exist"
    def add_arguments(self, parser):
        parser.add_argument('--source', action='store',
                            default='/server/app/management/scripts/sample_data.xlsx',
                            help='Indicates the source of the sample data to load. JSON or Excel file.')
        parser.add_argument('--delete', action='store_true', 
                            help='Indicates whether or not to delete the sample data')
        
    def handle(self, *args, **options):
        create_admin_user(username='admin', email='admin@local.com', password='admin123')
        print(f"Source: {options['source']}")
        print(f"Delete: {options['delete']}")
        load_sample_data(options['source'], options['delete'])
