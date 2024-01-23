from django.contrib.auth.models import User
from django.db import models
from .sample_data import applications, shortcuts, user_shortcuts, users
from app.models import Application, Shortcut, UserShortcut

def load_sample_data():
    # TOOD: This method will load sample data to the app (ie. sample users, items etc.)
    # Read applications from sample_data.py and create the objects here based on models.Application        
    # Read shortcuts from sample_data.py and create the objects here based on models.Shortcut
    # Read user_shortcuts from sample_data.py and create the objects here based on models.UserShortcut
    # Read users from sample_data.py and create the objects here based on django.contrib.auth.models.User
    # Make sure to set the password for each user using User.set_password()
    # Make sure to save each object after you create it
    
    temp_applications = []
    for application in applications:
        temp_application = Application(name=application['name'], 
                                       description=application['description'], 
                                       category=application['category'])
        temp_applications.append(temp_application)
    
    Application.objects.bulk_create(temp_applications, ignore_conflicts=True)
    
    temp_shortcuts = []
    for shortcut in shortcuts:
        temp_shortcut = Shortcut(
            application=Application.objects.get(name=shortcut['application']), 
            command=shortcut['command'], 
            mac=shortcut['mac'], 
            windows=shortcut['windows'], 
            linux=shortcut['linux'], 
            description=shortcut['description'])
        temp_shortcuts.append(temp_shortcut)
    
    Shortcut.objects.bulk_create(temp_shortcuts, ignore_conflicts=True)
    
    temp_users = []
    for user in users:
        temp_user = User(username=user['username'], email=user['email'])
        temp_user.set_password(user['password'])
        temp_users.append(temp_user)
    
    User.objects.bulk_create(temp_users, ignore_conflicts=True)
    
    temp_user_shortcuts = []
    for user_shortcut in user_shortcuts:
        temp_user_shortcut = UserShortcut(
            user=User.objects.get(username=user_shortcut['username']), 
            shortcut=Shortcut.objects.get(application__name=user_shortcut['application'], 
                                          command=user_shortcut['command']))
        temp_user_shortcuts.append(temp_user_shortcut)
    
    UserShortcut.objects.bulk_create(temp_user_shortcuts, ignore_conflicts=True)

def create_admin_user(username, email, password):
    admin_exists = User.objects.filter(username=username).exists()
    if not admin_exists:
        User.objects.create_superuser(username, email, password)

def delete_sample_data():
    Application.objects.all().delete()
    Shortcut.objects.all().delete()
    UserShortcut.objects.all().delete()
    User.objects.all().delete()
