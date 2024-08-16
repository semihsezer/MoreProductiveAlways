from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.http import JsonResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout

import jwt
from allauth.socialaccount.providers.oauth2.client import OAuth2Error
import time


import app.models as models
import app.utils as utils
from app.forms import SignUpForm
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, UpdateModelMixin
from rest_framework.pagination import PageNumberPagination
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.decorators import action
from rest_framework.viewsets import GenericViewSet
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


class DefaultPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = "page_size"
    max_page_size = 100


def _not_found():
    return JsonResponse({"message": "Property Not Found"}, status=404)


def example_ajax(request):
    return JsonResponse({"data": "test"}, status=200)


def login_user(request):
    loginFail = "False"
    message = ""
    if request.POST:
        user = authenticate(
            request,
            username=request.POST["username"].lower(),
            password=request.POST["password"],
        )

        if user is not None:
            login(request, user)
            return HttpResponseRedirect("/")
        else:
            loginFail = "True"
            message = "Wrong credentials."

    context = {"loginFail": loginFail, "message": message}
    template = loader.get_template("bootstrap/login.html")
    return HttpResponse(template.render(context, request))


def logout_user(request):
    logout(request)
    return HttpResponseRedirect("/accounts/login/")


def signup(request):
    if request.user and request.user.is_authenticated:
        return redirect("/")
    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            raw_password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect("/")
    else:
        form = SignUpForm()
    data = {"title": "Sign Up", "form": form, "submit_text": "Submit"}
    return render(request, "signup_form.html", data)


@login_required(login_url="/accounts/login/")
def account(request):
    user = request.user
    template = loader.get_template("account.html")
    context = {}
    return HttpResponse(template.render(context, request))


@login_required(login_url="/accounts/login/")
def version(request):
    versionArray = []
    with open("version.txt", "r") as file:
        versionArray = file.read().split("\n")
    context = {"versionArray": versionArray}
    template = loader.get_template("version.html")
    return HttpResponse(template.render(context, request))


def health(request):
    # TODO:
    data = {
        "status": "ok",
    }
    return JsonResponse(data)


@login_required(login_url="/accounts/login/")
def index(request):
    test_list = ["test1", "test2"]
    context = {"test_list": test_list}
    template = loader.get_template("home.html")
    return HttpResponse(template.render(context, request))


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
    # TODO: URL needs to be updated
    callback_url = "http://localhost:3000/social/google/callback"
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
