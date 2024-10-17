from django.contrib.auth.models import User
from django.db import models
from .sample_data import applications, shortcuts, user_shortcuts, users
import app.models as models
from openpyxl import load_workbook, Workbook


def load_sample_data(source="sample_data.json", delete=False):
    # TODO: This method will load sample data to the app (ie. sample users, items etc.)
    if delete == True:
        delete_sample_data()

    if source.endswith(".json"):
        load_sample_data_from_json(filename=source)
    elif source.endswith(".xlsx"):
        load_sample_data_from_excel(filename=source, create_users=True)
    else:
        raise Exception(
            "Invalid source file type. Please use either .json or .xlsx. Got filename: {source}"
        )


def load_sample_data_from_json(filename="sample_data.json"):
    raise ("Not Implemented: load_sample_data_from_json")


def load_sample_data_from_excel(filename="sample_data.xlsx", create_users=False):
    wb = load_workbook(filename=filename)
    load_sample_data_from_workbook(wb, create_users=create_users)


def load_sample_data_from_workbook(wb, create_users=False):
    if create_users:
        # Create User objects
        sheet = wb["User"]
        temp_users = []
        headers = [cell.value for cell in sheet[1]]
        for _row in sheet.iter_rows(min_row=2, values_only=True):
            if all(value is None for value in _row):
                continue
            row = dict(zip(headers, _row))
            temp_user = models.User(username=row["username"], email=row["email"])
            temp_user.set_password(row.get("password", "User123"))
            temp_users.append(temp_user)

        models.User.objects.bulk_create(temp_users, ignore_conflicts=True)

    # Create Application objects from df_application
    sheet = wb["Application"]
    headers = [cell.value for cell in sheet[1]]
    temp_applications = []
    for _row in sheet.iter_rows(min_row=2, values_only=True):
        if all(value is None for value in _row):
            continue
        row = dict(zip(headers, _row))
        temp_application = models.Application(
            name=row["name"], description=row["description"], category=row["category"]
        )
        temp_applications.append(temp_application)

    models.Application.objects.bulk_create(temp_applications, ignore_conflicts=True)

    # Create Shortcut objects from df_user_shortcut
    sheet = wb["UserShortcut"]
    headers = [cell.value for cell in sheet[1]]
    temp_shortcuts = []
    for _row in sheet.iter_rows(min_row=2, values_only=True):
        if all(value is None for value in _row):
            continue
        row = dict(zip(headers, _row))
        application = models.Application.objects.get(name=row["application_name"])
        temp_shortcut = models.Shortcut(
            application=application,
            command=row["command"],
            mac=row["mac"],
            description=row["description"],
            application_command=row["application_command"],
        )
        temp_shortcuts.append(temp_shortcut)

    # bulk create Shortcut objects, ignore conflicts
    models.Shortcut.objects.bulk_create(temp_shortcuts, ignore_conflicts=True)

    # Create UserShortcut objects from df_user_shortcut
    sheet = wb["UserShortcut"]
    headers = [cell.value for cell in sheet[1]]
    temp_user_shortcuts = []
    for _row in sheet.iter_rows(min_row=2, values_only=True):
        if all(value is None for value in _row):
            continue
        row = dict(zip(headers, _row))
        user = models.User.objects.get(username=row["username"])
        shortcut = models.Shortcut.objects.get(
            application__name=row["application_name"], command=row["command"]
        )
        temp_user_shortcut = models.UserShortcut(
            user=User.objects.get(username=row["username"]),
            shortcut=shortcut,
            user_mac=row["user_mac"],
            status=row["category"],
        )
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
    models.User.objects.exclude(username="admin").all().delete()
