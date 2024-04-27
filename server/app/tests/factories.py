import factory
from app.models import Idea, Application, Shortcut, UserShortcut
from django.contrib.auth.models import User


class IdeaFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Idea


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User


class ApplicationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Application


class ShortcutFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Shortcut


class UserShortcutFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserShortcut
