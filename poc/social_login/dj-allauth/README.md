### Python Social Auth

- [Django AllAuth Official Documentation](https://python-social-auth.readthedocs.io/en/latest/configuration/settings.html#application-setup)
- [DEV.to tutorial by Gajesh](https://dev.to/gajesh/the-complete-django-allauth-guide-la3)
- [TestDriven Tutorial](https://testdriven.io/blog/django-rest-authjs/#backend)
- [Headless API](https://allauth.org/docs/draft-api/) and they also have a [Demo React App](https://react.demo.allauth.org/)
- Their React demo app and headless option seems to be the choice for React frontend

1. `pip install `

2. in `settings.py` `INSTALLED_APPS`:
```
INSTALLED_APPS = [
    'django.contrib.admin',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
```

1. in `TEMPLATES`
```
TEMPLATES = [
  {
        ...
        'OPTIONS': {
            'context_processors': [
                ...
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.request',
            ],
        },
    },
]
```

1. AUTHENTICATION_BACKENDS
```
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)
```

1. `urls.py`
```
    re_path(r'^accounts/', include('allauth.urls')),
```

1. Migrate `python manage.py makemigrations` and `python manage.py migrate`

2. 

