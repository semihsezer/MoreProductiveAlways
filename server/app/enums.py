from django.db import models


# User Preferences
class OperatingSystem(models.TextChoices):
    MAC = "mac", "Mac"
    WINDOWS = "windows", "Windows"
    LINUX = "linux", "Linux"


class ApplicationCategory(models.TextChoices):
    SOFTWARE_DEVELOPMENT = "software_development", "Software Development"
    UX_DESIGN = "ux_design", "UX Design"
    DATA_SCIENCE = "data_science", "Data Science"
    GRAPHIC_DESIGN = "graphic_design", "Graphic Design"
    PHOTOGRAPHY = "photography", "Photography"
    VIDEOGRAPHY = "videography", "Videography"
    OTHER = "other", "Other"
