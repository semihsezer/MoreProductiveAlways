from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseServerError
from django.http import JsonResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
import json


import app.models as models
import app.utils as utils
from app.forms import SignUpForm
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework.response import Response
from .serializer import (
    ApplicationSerializer,
    ShortcutSerializer,
    UserIdeaSerializer,
    UserShortcutSerializer,
)


class UserObjectPermissions(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user


class UserObjectMixin:
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


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


def get_shortcuts(request):
    if request.method != "GET":
        return HttpResponseServerError("Only GET is allowed")

    # Get shortcuts where shortcut_id exists in user_shortcuts
    user_shortcuts = models.UserShortcut.objects.filter(user=request.user).all()
    user_shortcut_ids = [user_shortcut.shortcut_id for user_shortcut in user_shortcuts]

    query = models.Shortcut.objects
    if request.GET.get("application_name"):
        application_name = request.GET.get("application_name")
        query = query.filter(application__name=application_name)

    # LATER: use fuzzy search
    if request.GET.get("description"):
        description = request.GET.get("description")
        query = query.filter(description__icontains=description)

    # Get shortcuts where shortcut_id does not exist in user_shortcuts
    query = query.exclude(id__in=user_shortcut_ids).order_by(
        "application__name", "command"
    )

    # LATER: handle pagination
    shortcuts = query.all()
    shortcuts = utils.serialize_shortcuts(shortcuts)
    return JsonResponse(shortcuts, safe=False)


# Write a function to get the user's shortcuts from the database
# Login should be required to access this page
# TODO: enable login_required
# @login_required(login_url='/accounts/login/')
def get_user_shortcuts(request):
    # TODO: This excludes the user's shortcuts, make that explicit in the query
    user = request.user
    if request.method == "GET":
        query = models.UserShortcut.objects.filter(user=user)
        if request.GET.get("application_name"):
            application_name = request.GET.get("application_name")
            query = query.filter(application__name=application_name)

        # LATER: use fuzzy search
        if request.GET.get("description"):
            description = request.GET.get("description")
            query = query.filter(description__icontains=description)

        user_shortcuts = query.all()
        user_shortcuts = utils.serialize_user_shortcuts(user_shortcuts)
        return JsonResponse(user_shortcuts, safe=False)

    elif request.method == "POST":
        data = json.loads(request.body)
        user_shortcut = models.UserShortcut.objects.create(
            user=request.user, shortcut_id=data["shortcut_id"], status=data["status"]
        )

        return JsonResponse({"id": user_shortcut.id}, status=200)
    elif request.method == "PUT":
        data = json.loads(request.body)
        user = request.user
        # update UserShortcut.status field in one shot
        models.UserShortcut.objects.filter(id=data["shortcut_id"], user=user).update(
            status=data["status"]
        )
        return JsonResponse({"id": data["shortcut_id"]}, status=200)
    elif request.method == "DELETE":
        data = json.loads(request.body)
        user = request.user
        models.UserShortcut.objects.filter(id__in=data["ids"], user=user).delete()
        return JsonResponse({"message": "Deleted successfully."}, status=200)


def get_applications(request):
    if request.method == "GET":
        applications = models.Application.objects.all()
        applications = utils.serialize_applications(applications)
        return JsonResponse(applications, safe=False)
    else:
        return HttpResponseServerError("Only GET is allowed")


def get_user_ideas(request):
    if request.method == "GET":
        user = request.user
        # TODO
        # query = models.UserShortcut.objects.filter(user=user)
        query = models.Idea.objects
        status = request.GET.get("status")
        if status:
            # TODO: assert status is one of the valid choices
            query = query.filter(status=status)

        # LATER: handle pagination
        user_ideas = query.all()
        user_ideas = utils.serialize_user_ideas(user_ideas)
        return JsonResponse(user_ideas, safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        user = request.user
        title = data.get("title")
        description = data.get("description")
        application = data.get("application")
        type = data.get("type")
        status = data.get("status")
        idea = models.Idea(
            user=user, title=title, description=description, application=application
        )
        idea.save()
        return JsonResponse({"id": idea.id}, status=200)
    elif request.method == "PUT":
        # TODO: cleanup when we switch to Django REST
        data = json.loads(request.body)
        id = data.get("id")
        idea = models.Idea.objects.get(id=id)

        idea.title = data.get("title")
        idea.description = data.get("description")
        idea.application = data.get("application")
        idea.type = data.get("type")
        idea.status = data.get("status")
        idea.save()

        return JsonResponse({"id": idea.id}, status=200)
    elif request.method == "DELETE":
        data = json.loads(request.body)
        ids = data.get("ids")
        models.Idea.objects.filter(id__in=ids).delete()
        return JsonResponse({"message": "Ideas were deleted successfully."}, status=200)
    else:
        return HttpResponseServerError("Only GET and POST are allowed")


@login_required(login_url="/accounts/login/")
def index(request):
    test_list = ["test1", "test2"]
    context = {"test_list": test_list}
    template = loader.get_template("home.html")
    return HttpResponse(template.render(context, request))


class ApplicationViewSet(ModelViewSet):
    queryset = models.Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]


class ShortcutViewSet(ModelViewSet):
    queryset = models.Shortcut.objects.all()
    serializer_class = ShortcutSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserShortcutViewSet(ModelViewSet):
    queryset = models.UserShortcut.objects.all()
    serializer_class = UserShortcutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset().filter(user=self.request.user)
        return queryset


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

    # LEFT_HERE: Add all http methods for this viewset
