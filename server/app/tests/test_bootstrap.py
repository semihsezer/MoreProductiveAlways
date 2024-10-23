import os, django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()
import pytest
from openpyxl import load_workbook, Workbook
from unittest.mock import patch
from app.models import Application, Shortcut, UserShortcut
from django.contrib.auth.models import User
import app.management.scripts.bootstrap as bootstrap
from core.models import Config


class TestCase:
    @pytest.fixture
    def filename(self, user1):
        # We implicitly create user1, which is referred in the file
        filename = "server/app/tests/files/test_data.xlsx"
        Config.objects.create(key="SOURCE_DATA_FILENAME", value=filename)
        return "server/app/tests/files/test_data.xlsx"

    @pytest.mark.django_db
    def test_load_sample_data_from_excel(self, filename):
        filename = "server/app/tests/files/test_data.xlsx"

        bootstrap.load_sample_data(source=filename, delete=True)

        assert Application.objects.count() > 0
        assert Shortcut.objects.count() > 0
        assert UserShortcut.objects.count() > 0
