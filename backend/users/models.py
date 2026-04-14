from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    
    We use a custom user model to easily extend user attributes in the future
    and to implement role-based access control (RBAC) directly on the user entity.
    """
    
    # Role constants
    ROLE_CHOICES = (
        ('EMPLOYEE', 'Employee'),
        ('MANAGER', 'Manager'),
        ('HR', 'HR'),
    )
    
    # The 'role' field determines the user's permission level in the system.
    # - EMPLOYEE: Can only view/create their own leaves.
    # - MANAGER: Can approve/reject leaves for other employees.
    # - HR: Has full access to all leaves and system settings.
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='EMPLOYEE')

    def __str__(self):
        return f"{self.username} ({self.role})"
