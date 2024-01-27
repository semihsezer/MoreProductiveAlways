import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()
import pytest
import unittest
from unittest.mock import patch
import app.models as models
import app.management.scripts.bootstrap as bootstrap
import pandas as pd


class TestCase(unittest.TestCase):
    def setUp(self):
        pass
        
    @patch('django.contrib.auth.models.User.objects')
    @patch('app.models.UserShortcut.objects')
    @patch('app.models.Shortcut.objects')
    @patch('app.models.Application.objects')
    def test_load_sample_data_from_excel(self, m_application_objects, m_shortcut_objects, m_usershortcut_objects, m_user_objects):
        filename = '/server/app/management/scripts/sample_data.xlsx'
        df_user_shortcuts = pd.read_excel(filename, sheet_name='UserShortcut')
        df_applications = pd.read_excel(filename, sheet_name='Application')
        df_shortcuts = pd.read_excel(filename, sheet_name='Shortcut')
        df_users = pd.read_excel(filename, sheet_name='User')
        def my_side_effect(name):
            return models.Application(name=name)
        def shortcut_get(application__name, command):
            application = models.Application(name=application__name)
            return models.Shortcut(application=application, command=command)
        m_application_objects.get.side_effect = my_side_effect
        m_shortcut_objects.get.side_effect = shortcut_get
        m_user_objects.get.return_value = django.contrib.auth.models.User(username='test')
               
        bootstrap.load_sample_data(source=filename, delete=True)
        
        # Ensure Application objects are created
        assert len(m_application_objects.bulk_create.call_args[0][0]) == len(df_applications)
        # Ensure User objects are created
        assert len(m_user_objects.bulk_create.call_args[0][0]) == len(df_users)
        
        # Ensure all shortcuts from UserShortcut are created
        df_user_shortcuts['application_command'] = df_user_shortcuts['application_name'] + df_user_shortcuts['command']
        assert len(m_shortcut_objects.bulk_create.call_args[0][0]) == len(df_user_shortcuts['application_command'].unique())
        
        # Ensure all UserShortcut objects are created
        assert len(m_usershortcut_objects.bulk_create.call_args[0][0]) == len(df_user_shortcuts)