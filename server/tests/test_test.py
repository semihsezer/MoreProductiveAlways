import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rp.settings")
django.setup()
import pytest


def test_test():
    print('hello')
