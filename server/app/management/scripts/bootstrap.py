from django.contrib.auth.models import User

def load_sample_data():
    # TOOD: This method will load sample data to the app (ie. sample users, items etc.)
    pass

def create_admin_user(username, email, password):
    admin_exists = User.objects.filter(username=username).exists()
    if not admin_exists:
        User.objects.create_superuser(username, email, password)

def delete_sample_data():
    pass
