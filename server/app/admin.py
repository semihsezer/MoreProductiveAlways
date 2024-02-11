from django.contrib import admin
import app.models as models

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'category')
    search_fields = ['name', 'description', 'category']
    

class ShortcutAdmin(admin.ModelAdmin):
    list_display = ('application', 'command', 'mac', 'windows', 'linux', 'description')
    search_fields = ['application', 'command', 'mac', 'windows', 'linux', 'description']

class UserShortcutAdmin(admin.ModelAdmin):
    list_display = ('user', 'shortcut', 'category')
    search_fields = ['user', 'shortcut']

class IdeaAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'description', 'application', 'type', 'status')
    search_fields = ['user', 'title', 'description', 'application']
    

admin.site.register(models.Application, ApplicationAdmin)
admin.site.register(models.Shortcut, ShortcutAdmin)
admin.site.register(models.UserShortcut, UserShortcutAdmin)
admin.site.register(models.Idea, IdeaAdmin)
