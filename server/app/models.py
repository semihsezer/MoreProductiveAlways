from django.db import models
from django.db.models import Q
from django.conf import settings
from django.contrib.auth.models import User

# Django models go here


class Application(models.Model):
    name = models.CharField(unique=True, max_length=200)
    description = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    def __str__(self):
        return f"{self.name}"

USER_SHORTCUT_STATUS_CHOICES = [
    ('Saved', 'Saved'),
    ('Learning', 'Learning'),
    ('Mastered', 'Mastered'),
    ('Not Relevant', 'Not Relevant'),
]

SHORTCUT_CATEGORY_CHOICES = [
    ('Beginner', 'Beginner'),
    ('Intermediate', 'Intermediate'),
    ('Advanced', 'Advanced')
]

class Shortcut(models.Model):
    # add missing fields here referenced in bootstrap.py
    # add category field
    application = models.ForeignKey(Application, on_delete=models.CASCADE, db_index=True)
    command = models.CharField(max_length=200, db_index=True)
    mac = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    windows = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    linux = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    category = models.CharField(max_length=20, choices=SHORTCUT_CATEGORY_CHOICES, default="Beginner", db_index=True)
    application_command = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    description = models.CharField(max_length=500, null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    
    class Meta:
        unique_together = ('application', 'command')

    def __str__(self):
        return f"{self.application} - {self.command} - {self.mac}"

class UserShortcut(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    shortcut = models.ForeignKey(Shortcut, on_delete=models.CASCADE, db_index=True)
    user_mac = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    user_windows = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    user_linux = models.CharField(max_length=200, null=True, blank=True, db_index=True)
    status = models.CharField(max_length=200, choices=USER_SHORTCUT_STATUS_CHOICES, default="Saved", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    
    class Meta:
        unique_together = ('user', 'shortcut')

    def __str__(self):
        return f"{self.user} - {self.shortcut}"


IDEA_STATUS_CHOICES = [
    ('Open', 'Open'),
    ('In Progress', 'In Progress'),
    ('Closed', 'Closed'),
    ('Done', 'Done'),
]

IDEA_TYPE_CHOICES = [
    ('Shortcut', 'Shortcut'),
    ('Workflow', 'Workflow'),
    ('Application', 'Application'),
    ('Extension/Plugin', 'Extension/Plugin'),
]

class Idea(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    title = models.CharField(max_length=500, db_index=True)
    type = models.CharField(max_length=200, choices=IDEA_TYPE_CHOICES, default="Shortcut", db_index=True)
    description = models.CharField(max_length=500, null=True, blank=True, db_index=True)
    application = models.ForeignKey(Application, null=True, on_delete=models.CASCADE, db_index=True)
    status = models.CharField(max_length=200, choices=IDEA_STATUS_CHOICES, default="Open", db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    
    def __str__(self):
        return f"{self.user} - {self.title}"
                             
    