from django.contrib import admin
import app.models as models


class ApplicationAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "category")
    search_fields = ["name", "description", "category"]


class UserApplicationAdmin(admin.ModelAdmin):
    list_display = ("user", "application")
    search_fields = ["user", "application"]
    list_filter = ("application", "user")


class ShortcutAdmin(admin.ModelAdmin):
    list_display = ("application", "command", "mac", "windows", "linux", "description")
    search_fields = ["application", "command", "mac", "windows", "linux", "description"]
    list_filter = ("application",)


class UserShortcutAdmin(admin.ModelAdmin):
    list_display = ("user", "shortcut", "status")
    search_fields = ["user", "shortcut"]
    list_filter = ("shortcut__application", "status", "user")


class IdeaAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "description", "application", "type", "status")
    search_fields = ["user", "title", "description", "application"]


class UserPreferenceAdmin(admin.ModelAdmin):
    list_display = ("user", "operating_system", "application_categories")
    search_fields = ["user", "operating_system", "application_categories"]


admin.site.register(models.Application, ApplicationAdmin)
admin.site.register(models.Shortcut, ShortcutAdmin)
admin.site.register(models.UserShortcut, UserShortcutAdmin)
admin.site.register(models.Idea, IdeaAdmin)
admin.site.register(models.UserApplication, UserApplicationAdmin)
admin.site.register(models.UserPreference, UserPreferenceAdmin)
