from django.contrib import admin
from app.models import Application, Shortcut, UserShortcut

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'category')
    search_fields = ['name', 'description', 'category']
    

class ShortcutAdmin(admin.ModelAdmin):
    list_display = ('application', 'command', 'mac', 'windows', 'linux', 'description')
    search_fields = ['application', 'command', 'mac', 'windows', 'linux', 'description']

class UserShortcutAdmin(admin.ModelAdmin):
    list_display = ('user', 'shortcut', 'category')
    search_fields = ['user', 'shortcut']
    

admin.site.register(Application, ApplicationAdmin)
admin.site.register(Shortcut, ShortcutAdmin)
admin.site.register(UserShortcut, UserShortcutAdmin)
