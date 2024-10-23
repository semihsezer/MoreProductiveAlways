from django.contrib import admin
import core.models as models


class ConfigAdmin(admin.ModelAdmin):
    list_display = ("key", "value")
    search_fields = ["key", "value"]
    ordering = ["key"]


# Register your models here.
admin.site.register(models.Config, ConfigAdmin)
