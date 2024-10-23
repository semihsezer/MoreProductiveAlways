import pytest

from django.test import TestCase, Client

from app.models import Shortcut, Application, UserShortcut, Idea, UserApplication
from django.contrib.auth.models import User
from app.tests.factories import IdeaFactory, UserApplicationFactory, UserFactory


@pytest.fixture
def anon_client():
    return Client()


@pytest.mark.django_db
class TestIdeaViews:
    def url(self, idea=None):
        if idea is None:
            return "/api/idea/"
        else:
            return f"/api/idea/{idea.id}/"

    def test_anon_user_cannot_create(self, anon_client):
        response = anon_client.post(self.url(), data={})
        assert response.status_code == 401

    def test_create(self, auth_client):
        title, desc = "title", "desc"
        response = auth_client.post(
            self.url(), data={"title": title, "description": desc}
        )

        assert response.status_code == 201
        idea = Idea.objects.get(title=title, description=desc, user=auth_client.user)
        assert idea is not None

    def test_others_cannot_access(self, auth_client, anon_client, auth_client_user2):
        idea = IdeaFactory(user=auth_client.user)

        response = anon_client.get(self.url(idea))
        assert response.status_code == 401

        response = auth_client_user2.get(self.url(idea))
        assert response.status_code == 404


@pytest.mark.django_db
class TestUserApplicationView:
    def url(self, user_application):
        return f"/api/user/application/{user_application.id}"

    def test_delete(self, auth_client):
        user_application = UserApplicationFactory(user=auth_client.user)
        res = auth_client.delete(self.url(user_application))

        assert res.status_code == 204
        assert UserApplication.objects.count() == 0

    def test_delete_not_same_user(self, auth_client):
        user_application = UserApplicationFactory(user=UserFactory())
        res = auth_client.delete(self.url(user_application))

        assert res.status_code == 403
        assert UserApplication.objects.count() == 1
