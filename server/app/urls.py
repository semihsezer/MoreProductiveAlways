from django.urls import path, include
from django.conf.urls import url
from django.contrib import admin

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('version', views.version, name='version'),
    url(r'^health', views.health, name='health'),
    path('admin/', admin.site.urls),
    url('signup/$', views.signup, name='signup'),
    path('accounts/login/',views.login_user, name='login_user'),
    path('accounts/logout/',views.logout_user, name='logout_user'),

    # Ajax
    url(r'^api/ajax/example$', views.example_ajax, name='example_ajax'),
    url(r'^api/shortcut$', views.get_shortcuts, name='get_shortcuts'),
    url(r'^api/user/shortcut$', views.get_user_shortcuts, name='get_user_shortcuts'),
    url(r'^api/applications$', views.get_applications, name='get_applications'),
    url(r'^api/user/ideas$', views.get_user_ideas, name='get_user_ideas'),
]
