### Python Social Auth

[Python Social Auth](https://python-social-auth.readthedocs.io/en/latest/configuration/settings.html#application-setup)

#### Summary
- Seems to only work with Session Authentication (not with DjangoRestTokenAuth or SimpleJWTAuth)
- Hooking it up to DRF TokenAuth
  - [Custom Strategy with this StackOverflow Post](https://stackoverflow.com/questions/67508421/get-drf-token-from-python-social-auth-backend)

This is the configuration with Django Session Authentication.

1. `pip install "social-auth-core`
2.  Add it to installed apps
```INSTALLED_APPS = (
    ...
    'social_django',
    ...
)
```

1. Add these to settings.py
```
SOCIAL_AUTH_JSONFIELD_ENABLED = True
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '<clientid>'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '<secret>'
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ['email']
SOCIAL_AUTH_LOGIN_REDIRECT_URL = "http://localhost:3000/discover"
```

1. in settings.py
```
AUTHENTICATION_BACKENDS = [
    'social_core.backends.google.GoogleOAuth2',
    "django.contrib.auth.backends.ModelBackend",
]
```

1. in `settings.py`: Only works with SessionAuthentication
```
REST_FRAMEWORK = {
    ...
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
}
```

1. in `urls.py`
   
```
...
re_path('', include('social_django.urls', namespace='social')),
...
```

1. Migrate `python server/manage.py migrate`

1. Add this to [LoginPage.js](<a href="http://localhost:8000/login/google-oauth2/">Login with Google</a>)

1. On Success, call `axios.get("/complete/google-oauth2/")`

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

2. Add this to templates/login.html
`<a href="{% url "social:begin" "google-oauth2" %}">Google+</a>`

3. Right click to find the url
