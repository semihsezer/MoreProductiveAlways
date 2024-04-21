from django.contrib.auth.models import User
from django.db import models
from .sample_data import applications, shortcuts, user_shortcuts, users
import app.models as models
import pandas as pd 

def load_sample_data(source='sample_data.json', delete=False):
    # TODO: This method will load sample data to the app (ie. sample users, items etc.)  
    if delete==True:
        delete_sample_data()
    
    if source.endswith('.json'):
        load_sample_data_from_json(filename=source)
    elif source.endswith('.xlsx'):
        load_sample_data_from_excel(filename=source)
    else:
        raise Exception("Invalid source file type. Please use either .json or .xlsx. Got filename: {source}")

def load_sample_data_from_json(filename='sample_data.json'):
    raise("Not Implemented: load_sample_data_from_json")

def load_sample_data_from_excel(filename='sample_data.xlsx'):   
    df_user_shortcut = pd.read_excel(filename, sheet_name='UserShortcut')
    df_application = pd.read_excel(filename, sheet_name='Application')
    df_shortcut = pd.read_excel(filename, sheet_name='Shortcut')
    df_user = pd.read_excel(filename, sheet_name='User')
    # Replace all nan fields with null
    df_user_shortcut = df_user_shortcut.where(pd.notnull(df_user_shortcut), None)
    
    # Create User objects from df_user
    temp_users = []
    for index, row in df_user.iterrows():
        temp_user = models.User(username=row['username'], email=row['email'])
        temp_user.set_password(row.get('password', 'User123'))
        temp_users.append(temp_user)
    
    models.User.objects.bulk_create(temp_users, ignore_conflicts=True)
    
    # Create Application objects from df_application
    temp_applications = []
    for index, row in df_application.iterrows():
        temp_application = models.Application(name=row['name'], 
                                       description=row['description'], 
                                       category=row['category'])
        temp_applications.append(temp_application)
    
    models.Application.objects.bulk_create(temp_applications, ignore_conflicts=True)
    
    
    # Create Shortcut objects from df_user_shortcut
    temp_shortcuts = []
    for index, row in df_user_shortcut.iterrows():
        application = models.Application.objects.get(name=row['application_name'])
        temp_shortcut = models.Shortcut(
            application=application,
            # LATER: extension
            command=row['command'],
            mac=row['mac'],
            description=row['description'],
            application_command=row['application_command'])
        temp_shortcuts.append(temp_shortcut)
    
    # bulk create Shortcut objects, ignore conflicts
    models.Shortcut.objects.bulk_create(temp_shortcuts, ignore_conflicts=True)
    
    # Create UserShortcut objects from df_user_shortcut
    temp_user_shortcuts = []
    for index, row in df_user_shortcut.iterrows():
        user = models.User.objects.get(username=row['username'])
        shortcut = models.Shortcut.objects.get(application__name=row['application_name'], 
                                        command=row['command'])
        temp_user_shortcut = models.UserShortcut(
            user=User.objects.get(username=row['username']),
            shortcut=shortcut,
            user_mac = row['user_mac'],
            status = row['category'])
        temp_user_shortcuts.append(temp_user_shortcut)
    
    # Bulk create UserShortcut objects, ignore conflicts
    models.UserShortcut.objects.bulk_create(temp_user_shortcuts, ignore_conflicts=True)
    

def create_admin_user(username, email, password):
    admin_exists = models.User.objects.filter(username=username).exists()
    if not admin_exists:
        models.User.objects.create_superuser(username, email, password)

def delete_sample_data():
    models.Application.objects.all().delete()
    models.Shortcut.objects.all().delete()
    models.UserShortcut.objects.all().delete()
    models.User.objects.exclude(username='admin').all().delete()

def test_model_mock():
    application = models.Application.objects.get(name='x')
    return application
