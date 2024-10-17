import pytest
import os, django
from django.core.files.uploadedfile import SimpleUploadedFile
from openpyxl import load_workbook, Workbook
from app.models import Application, Shortcut, UserShortcut
from django.contrib.auth.models import User

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()


@pytest.mark.django_db
class TestBulkUploadView:
    @pytest.fixture
    def url(self):
        return "/api/bulk/upload_csv"

    def test_no_file(self, auth_client, url):
        res = auth_client.post(url, data={})
        assert res.status_code == 400

    def test_not_csv_ending(self, auth_client, url):
        file_content = b"This is a test file content"
        test_file = SimpleUploadedFile(
            "test_file.txt", file_content, content_type="text/plain"
        )
        data = {"file": test_file}
        res = auth_client.post(url, data=data)
        assert res.status_code == 400

    def test(self, auth_client, url):
        filename = "server/app/management/scripts/sample_data.xlsx"
        initial_application_count = Application.objects.count()
        initial_shortcut_count = Shortcut.objects.count()
        initial_usershortcut_count = UserShortcut.objects.count()

        with open(filename, "rb") as f:
            file_content = f.read()
            test_file = SimpleUploadedFile(
                "test_file.csv", file_content, content_type="text/csv"
            )
            data = {"file": test_file}
            res = auth_client.post(url, data=data)
            assert res.status_code == 200
            assert Application.objects.count() > initial_application_count
            assert Shortcut.objects.count() > initial_shortcut_count
            assert UserShortcut.objects.count() > initial_usershortcut_count
