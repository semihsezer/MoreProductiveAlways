from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, CharField, CurrentUserDefault
from django.contrib.auth.models import User
from app.models import Application, Idea, UserShortcut, Shortcut

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'id')


class ApplicationSerializer(ModelSerializer):
    class Meta:
        model = Application
        fields = ('id', 'name', 'description', 'category')


class UserIdeaSerializer(ModelSerializer):
    username = CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Idea
        fields = ('id', 'title', 'username', 'application', 'description', 
                  'type', 'status', 'created_at', 'updated_at')


class ShortcutSerializer(ModelSerializer):
    application = ApplicationSerializer()
    
    class Meta:
        model = Shortcut
        fields = ('id', 'application', 'command', 'mac', 'windows', 'linux', 
                  'category', 'application_command', 'description')


class UserShortcutSerializer(ModelSerializer):
    username = CharField(source='user.username')
    shortcut = ShortcutSerializer(read_only=True)
    
    class Meta:
        model = UserShortcut
        fields = ('id', 'username', 'shortcut', 
                  'user_mac', 'user_windows', 'user_linux', 
                  'status')