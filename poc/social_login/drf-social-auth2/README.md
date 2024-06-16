### DRF Social Auth

- [DRF Social OAuth2](https://drf-social-oauth2.readthedocs.io/)

#### Summary

#### Steps

1. `pip install drf_social_oauth2==2.2.0`
2.  Add it to installed apps
```
INSTALLED_APPS = (
    ...
    'oauth2_provider',
    'social_django',
    'drf_social_oauth2',
)
```

1. Add these to settings.py
```
SOCIAL_AUTH_JSONFIELD_ENABLED = True
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = <your app id goes here>
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = <your app secret goes here>

SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]

#SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['email']
#SOCIAL_AUTH_LOGIN_REDIRECT_URL = "http://localhost:3000/discover"
```

1. in settings.py
```
AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    'drf_social_oauth2.backends.DjangoOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]
```

1. in `settings.py`: Only works with SessionAuthentication
```
REST_FRAMEWORK = {
    ...
    "DEFAULT_AUTHENTICATION_CLASSES": (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
        'drf_social_oauth2.authentication.SocialAuthentication',
    ),
}
```

1. in `urls.py`
   
```
...
re_path(r'^auth/', include('drf_social_oauth2.urls', namespace='drf')),
...
```

1. Migrate `python server/manage.py migrate`

1. Add a new application in Django Admin [link](https://drf-social-oauth2.readthedocs.io/en/latest/application.html)

2. TODO: Add this to [LoginPage.js](<a href="http://localhost:8000/login/google-oauth2/">Login with Google</a>)

3. TODO: On Success, call `axios.get("/complete/google-oauth2/")` TODO:


### Backwards Engineering
1. Add this to templates
```
TEMPLATES = [
    {
        ...
        "OPTIONS": {
            "context_processors": [
                ...
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
                ...
```

1. Add this to templates/login.html
`<a href="{% url "social:begin" "google-oauth2" %}">Google+</a>`

1. Right click to find the url

1. Additional settings
    `DRFSO2_PROPRIETARY_BACKEND_NAME`: name of your OAuth2 social backend (e.g "Facebook"), defaults to "Django"
    `DRFSO2_URL_NAMESPACE`: namespace for reversing URLs
    `ACTIVATE_JWT`: If set to True the access and refresh tokens will be JWTed. Default is False.
