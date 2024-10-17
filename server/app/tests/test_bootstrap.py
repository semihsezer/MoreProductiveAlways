import os, django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()
import pytest
from openpyxl import load_workbook, Workbook
from unittest.mock import patch
from app.models import Application, Shortcut, UserShortcut
from django.contrib.auth.models import User
import app.management.scripts.bootstrap as bootstrap

# import pandas as pd


class TestCase:
    @pytest.mark.django_db
    def test_load_sample_data_from_excel(self):
        filename = "server/app/management/scripts/sample_data.xlsx"

        bootstrap.load_sample_data(source=filename, delete=True)

        assert Application.objects.count() > 0
        assert User.objects.count() > 0
        assert Shortcut.objects.count() > 0
        assert UserShortcut.objects.count() > 0
