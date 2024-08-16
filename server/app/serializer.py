from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    CharField,
    CurrentUserDefault,
    ValidationError,
    SerializerMethodField,
)
from django.contrib.auth.models import User
from app.models import (
    Application,
    Idea,
    UserPreference,
    UserShortcut,
    Shortcut,
    UserApplication,
)
from app.enums import OperatingSystem, ApplicationCategory
from app.utils import django_text_choices_to_dict_list


class UserObjectPermissionMixin:
    def validate_user(self, user):
        if user != self.context["request"].user:
            raise ValidationError("You can only create this object for your user.")


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "id")


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = ("id", "name", "description", "category")


class UserApplicationSubmitSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )
    application = PrimaryKeyRelatedField(queryset=Application.objects.all())

    class Meta:
        model = UserApplication
        fields = ("id", "user", "application")
        read_only_fields = ("id",)


class UserApplicationSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )
    application = ApplicationSerializer()

    class Meta:
        model = UserApplication
        fields = ("id", "user", "application")
        read_only_fields = ("id",)


class UserIdeaSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )

    class Meta:
        model = Idea
        fields = (
            "id",
            "title",
            "user",
            "application",
            "description",
            "type",
            "status",
            "created_at",
            "updated_at",
        )


class ShortcutSerializer(ModelSerializer):
    application = ApplicationSerializer()

    class Meta:
        model = Shortcut
        fields = (
            "id",
            "application",
            "command",
            "mac",
            "windows",
            "linux",
            "category",
            "application_command",
            "description",
        )
        read_only_fields = ("id",)


class UserShortcutSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )
    shortcut = ShortcutSerializer(read_only=True)

    class Meta:
        model = UserShortcut
        fields = (
            "id",
            "user",
            "shortcut",
            "user_mac",
            "user_windows",
            "user_linux",
            "status",
        )
        read_only_fields = ("id",)


class UserShortcutSubmitSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )
    shortcut_id = PrimaryKeyRelatedField(
        queryset=Shortcut.objects.all(), source="shortcut", write_only=True
    )

    class Meta:
        model = UserShortcut
        fields = ("id", "user", "shortcut_id", "status")
        read_only_fields = ("id", "shortcut_id")


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email", "id")


class UserPreferenceSubmitSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )

    class Meta:
        model = UserPreference
        fields = ("id", "user", "operating_system", "application_categories")
        read_only_fields = ("id", "user")


class UserPreferenceSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=CurrentUserDefault()
    )
    operating_system = SerializerMethodField()
    application_categories = SerializerMethodField()

    def get_operating_system(self, obj):
        return {
            "value": obj.operating_system,
            "label": "Operating System",
            "choices": django_text_choices_to_dict_list(OperatingSystem),
        }

    def get_application_categories(self, obj):
        return {
            "value": obj.application_categories,
            "label": "Application Categories",
            "choices": django_text_choices_to_dict_list(ApplicationCategory),
        }

    class Meta:
        model = UserPreference
        fields = ("id", "user", "operating_system", "application_categories")
        read_only_fields = ("id", "user")
