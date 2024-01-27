import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()
import pytest
import django.test
import app.models as models
import app.management.scripts.bootstrap as bootstrap
import pandas as pd


class TestCase(django.test.TestCase):
    def setUp(self):
        pass
        
    def test_load_sample_data_from_excel(self):
        filename = '/server/app/management/scripts/sample_data.xlsx'
        bootstrap.load_sample_data(source=filename, delete=True)
        df_user_shortcuts = pd.read_excel(filename, sheet_name='UserShortcut')
        df_applications = pd.read_excel(filename, sheet_name='Application')
        df_shortcuts = pd.read_excel(filename, sheet_name='Shortcut')
        df_users = pd.read_excel(filename, sheet_name='User')
               
        assert len(df_applications) == models.Application.objects.all().count()
        assert len(df_users) == models.User.objects.all().count()
        
        # Ensure all shortcuts from UserShortcut are created
        df_user_shortcuts['application_command'] = df_user_shortcuts['application_name'] + df_user_shortcuts['command']
        assert len(df_user_shortcuts['application_command'].unique()) == models.Shortcut.objects.all().count()
        
        # Ensure all UserShortcut objects are created
        assert len(df_user_shortcuts) == models.UserShortcut.objects.all().count()