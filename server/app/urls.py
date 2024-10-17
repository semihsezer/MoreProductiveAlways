from django.urls import include, re_path
from django.contrib import admin
from django.views.decorators.csrf import get_token

from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from . import views


class OptionalSlashDefaultRouter(routers.DefaultRouter):
    """Make all trailing slashes optional in the URLs used by the viewsets"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.trailing_slash = "/?"


router = OptionalSlashDefaultRouter()
router.register(r"api/idea", views.IdeaViewSet)
router.register(r"api/user/shortcut", views.UserShortcutViewSet)
router.register(r"api/application", views.ApplicationViewSet)
router.register(
    r"api/user/application", views.UserApplicationViewSet, "user-application"
)
router.register(r"api/shortcut", views.ShortcutViewSet)
router.register(r"api/user/profile", views.UserProfileViewSet)
router.register(r"api/user/preference", views.UserPreferenceViewSet)
router.register(
    r"api/discover/shortcut", views.DiscoverShortcutViewSet, "discover-shortcut"
)
router.register(r"api/bulk", views.BulkUploadViewSet, "bulk")


urlpatterns = [
    re_path("", include(router.urls)),
    re_path("admin/", admin.site.urls),
    re_path("api/dj-rest-auth/", include("dj_rest_auth.urls")),
    re_path(
        "api/dj-rest-auth/registration/", include("dj_rest_auth.registration.urls")
    ),
    re_path(
        "api/dj-rest-auth/google/", views.GoogleLogin.as_view(), name="google_login"
    ),
    re_path("accounts/", include("allauth.urls")),
    re_path("api-auth/", include("rest_framework.urls")),
    re_path("api/token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    re_path("api/token/verify", TokenVerifyView.as_view(), name="token_verify"),
    re_path("api/token", TokenObtainPairView.as_view(), name="token_obtain_pair"),
]
