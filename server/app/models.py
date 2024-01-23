from django.db import models
from django.db.models import Q
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from six import python_2_unicode_compatible

import uuid
import pytz
from datetime import datetime

# Django models go here


# create a new model  called "ProductivityTip" with the following fields: application, shortcut, description, created, updated
# application - the name of the application the shortcut is for
# shortcut - the keyboard shortcut
# description - a description of what the shortcut does
# created - the date and time the shortcut was created
# updated - the date and time the shortcut was last updated

class Application(models.Model):
    name = models.CharField(unique=True, max_length=200)
    description = models.CharField(max_length=500)
    category = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return f"{self.name}"

  
class Shortcut(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    command = models.CharField(max_length=200)
    mac = models.CharField(max_length=200)
    windows = models.CharField(max_length=200)
    linux = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('application', 'command')

    def __str__(self):
        return f"{self.application} - {self.command} - {self.mac}"

USERSHORTCUT_CATEGORY_CHOICES = [
    ('Saved', 'Saved'),
    ('Learning', 'Learning'),
    ('Mastered', 'Mastered'),
]

# TODO: make category an enum field or restricted choice field
class UserShortcut(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shortcut = models.ForeignKey(Shortcut, on_delete=models.CASCADE)
    category = models.CharField(max_length=200, choices=USERSHORTCUT_CATEGORY_CHOICES, default="Saved")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'shortcut')

    def __str__(self):
        return f"{self.user} - {self.shortcut}"

