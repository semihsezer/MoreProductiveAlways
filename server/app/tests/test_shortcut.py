import os, django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mpa.settings")
django.setup()
import pytest
from django.db.utils import IntegrityError

from app.models import Application, Shortcut


class TestShortcutModel:
    @pytest.mark.django_db
    def test_uniqueness_submodule_level_empty_string(self):
        application = Application.objects.create(name="app1")

        # Two empty submoddules raise uniqueness error
        with pytest.raises(IntegrityError):
            Shortcut.objects.create(
                application=application, submodule="", command="cmd1"
            )

            Shortcut.objects.create(
                application=application, submodule="", command="cmd1"
            )

    @pytest.mark.django_db
    def test_uniqueness_without_providing_submodule(self):
        application = Application.objects.create(name="app1")
        with pytest.raises(IntegrityError):
            Shortcut.objects.create(application=application, command="cmd1")

            Shortcut.objects.create(application=application, command="cmd1")
