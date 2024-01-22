from django.db import models
from django.db.models import Q
from django.conf import settings
from django.contrib import admin
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from six import python_2_unicode_compatible

import uuid
import pytz
from datetime import datetime

# Django models go here
