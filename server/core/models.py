from django.db import models
from django.db.models import Q
from django.conf import settings
from django.contrib.auth.models import User
from shortuuid.django_fields import ShortUUIDField


class BaseModel(models.Model):
    id = ShortUUIDField(primary_key=True, editable=False)

    class Meta:
        abstract = True


class TimestampedModel(BaseModel):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Config(TimestampedModel):
    key = models.CharField(unique=True, max_length=200, db_index=True)
    value = models.CharField(max_length=200, blank=True)
    description = models.CharField(max_length=200, blank=True)

    @classmethod
    def get(cls, key: str, default=None):
        try:
            return Config.objects.get(key=key).value
        except Config.DoesNotExist:
            return default
