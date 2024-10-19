from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.http import JsonResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

import jwt
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
import time
from django.conf import settings


import app.models as models
from openpyxl import load_workbook
from .management.scripts.bootstrap import (
    export_data_to_workbook,
    load_sample_data_from_workbook,
)
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.generics import CreateAPIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.pagination import PageNumberPagination
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from .serializer import (
    ApplicationSerializer,
    ShortcutSerializer,
    UserIdeaSerializer,
    UserPreferenceSerializer,
    UserPreferenceSubmitSerializer,
    UserSerializer,
    UserShortcutSerializer,
    UserShortcutSubmitSerializer,
    UserApplicationSubmitSerializer,
    UserApplicationSerializer,
)


class UserObjectPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_superuser


class IsOpsAdmin(permissions.BasePermission):
    """Users who have admin permissions in the app (not Django admin)"""

    OPS_ADMIN_GROUP = "ops_admin"

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.groups.filter(name=self.OPS_ADMIN_GROUP).exists()
        )


class DefaultPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 100


class GoogleOAuth2IatValidationAdapter(GoogleOAuth2Adapter):
    """This adapter is only needed to wait for a small delta time because
    the returned 'iat' time is sometimes in the future. Hopefully this will
    be fixed in upcoming updates.

    https://github.com/iMerica/dj-rest-auth/issues/503
    """

    def complete_login(self, request, app, token, response, **kwargs):
        try:
            delta_time = (
                jwt.decode(
                    response.get("id_token"),
                    options={"verify_signature": False},
                    algorithms=["RS256"],
                )["iat"]
                - time.time()
            )
        except jwt.PyJWTError as e:
            raise OAuth2Error("Invalid id_token during 'iat' validation") from e
        except KeyError as e:
            raise OAuth2Error("Failed to get 'iat' from id_token") from e

        # Or change 30 to whatever you feel is a maximum amount of time you are willing to wait
        if delta_time > 0 and delta_time <= 30:
            time.sleep(delta_time)

        return super().complete_login(request, app, token, response, **kwargs)


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2IatValidationAdapter
    callback_url = f"{settings.FRONTEND_URL}/social/google/callback"
    client_class = OAuth2Client


class ApplicationViewSet(ModelViewSet):
    queryset = models.Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.AllowAny]


class UserApplicationViewSet(ModelViewSet, ListModelMixin):
    queryset = models.UserApplication.objects.all()
    serializer_class = UserApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, UserObjectPermissions]

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == "DELETE" or self.request.method == "POST":
            return UserApplicationSubmitSerializer
        return self.serializer_class

    def list(self, request, *args, **kwargs):
        applications = []
        if request.GET["status"]:
            user_applications = list(self.queryset.filter(user=request.user).all())
            user_application_ids = [ua.application.id for ua in user_applications]
            non_user_applications = models.Application.objects.exclude(
                id__in=user_application_ids
            )
            non_user_applications = [
                models.UserApplication(application=app) for app in non_user_applications
            ]

            # TODO: Use filterclass for these?
            if request.GET["status"] == "all":
                applications = user_applications + non_user_applications
            elif request.GET["status"] == "unsaved":
                applications = non_user_applications
            else:
                raise ValueError("Invalid status, must be 'all' or 'unsaved'")

        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return super().destroy(request, *args, **kwargs)


class ShortcutViewSet(ModelViewSet):
    queryset = models.Shortcut.objects.all()
    serializer_class = ShortcutSerializer
    permission_classes = [permissions.AllowAny]


class UserShortcutViewSet(ModelViewSet, ListModelMixin):
    queryset = models.UserShortcut.objects.all()
    serializer_class = UserShortcutSerializer
    permission_classes = [permissions.IsAuthenticated, UserObjectPermissions]
    filterset_fields = ("status",)

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == "DELETE" or self.request.method == "POST":
            return UserShortcutSubmitSerializer
        return self.serializer_class

    def get_queryset(self):
        queryset = super().get_queryset().filter(user=self.request.user)
        return queryset

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


class DiscoverShortcutViewSet(GenericViewSet, ListModelMixin):
    queryset = models.UserShortcut.objects.all()
    serializer_class = UserShortcutSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request):
        shortcuts = []
        if request.user and request.user.is_authenticated:
            qs = self.queryset.filter(user=request.user)
            user_shortcut_ids = [qs.values_list("shortcut_id", flat=True)]
            non_user_shortcuts = models.Shortcut.objects.exclude(
                id__in=user_shortcut_ids
            )
            shortcuts = [
                models.UserShortcut(shortcut=shortcut, status=None)
                for shortcut in non_user_shortcuts
            ]
        else:
            all_shortcuts = models.Shortcut.objects.all()
            shortcuts = [
                models.UserShortcut(shortcut=shortcut, status=None)
                for shortcut in all_shortcuts
            ]

        serializer = UserShortcutSerializer(shortcuts, many=True)
        return Response(serializer.data)


class IdeaViewSet(ModelViewSet):
    queryset = models.Idea.objects.all()
    serializer_class = UserIdeaSerializer
    permission_classes = [permissions.IsAuthenticated, UserObjectPermissions]
    filterset_fields = ("status",)

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def put(self, request, pk=None):
        print("hey put")


class UserProfileViewSet(ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        instance = request.user
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class UserPreferenceViewSet(ModelViewSet):
    queryset = models.UserPreference.objects.all()
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated, UserObjectPermissions]

    def get_serializer(self, *args, **kwargs):
        if self.request.method in ["PATCH", "PUT"]:
            return UserPreferenceSubmitSerializer(*args, **kwargs)
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        user_preference, _ = models.UserPreference.objects.get_or_create(
            user=request.user
        )
        return Response(UserPreferenceSerializer(user_preference).data)


class BulkUploadViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOpsAdmin]
    serializer_class = ApplicationSerializer
    queryset = models.Application.objects.all()

    @action(
        detail=False, methods=["POST"], url_path="upload_excel", url_name="upload-excel"
    )
    def upload_excel(self, request):
        excel_file = request.FILES.get("file")
        if not excel_file:
            return Response(
                {"message": "Please provide a file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        wb = load_workbook(excel_file)
        load_sample_data_from_workbook(wb)
        return Response(
            {"message": "Excel file uploaded successfully"}, status=status.HTTP_200_OK
        )

    @action(
        detail=False, methods=["GET"], url_path="export_excel", url_name="export-excel"
    )
    def export_excel(self, request):
        wb = export_data_to_workbook()
        response = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        response["Content-Disposition"] = "attachment; filename=sample_data.xlsx"
        wb.save(response)
        return response
