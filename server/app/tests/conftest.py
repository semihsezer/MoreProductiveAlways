import pytest
from django.contrib.auth.models import User, Group, Permission
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from factories import UserFactory
from app.views import IsOpsAdmin


@pytest.fixture
def user1():
    return UserFactory(username="user1", password="test")


@pytest.fixture
def user2():
    return UserFactory(username="user2", password="test")


@pytest.fixture
def ops_user():
    user = UserFactory(username="ops_user", password="test")
    group_name = Group.objects.get(name=IsOpsAdmin.OPS_ADMIN_GROUP)
    user.groups.add(group_name)
    user.save()
    return user


def make_client(user):
    client = APIClient(default_format="json")
    client.force_authenticate(user=user)
    client.user = user

    return client


@pytest.fixture
def auth_client(user1):
    return make_client(user1)


@pytest.fixture
def auth_client_user2(user2):
    return make_client(user2)


@pytest.fixture
def ops_client(ops_user):
    return make_client(ops_user)
