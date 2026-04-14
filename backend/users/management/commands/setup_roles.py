from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group
from leaves.models import LeaveType

class Command(BaseCommand):
    help = 'Setup initial roles and leave types'

    def handle(self, *args, **kwargs):
        # Create Groups
        groups = ['Employee', 'Manager', 'HR']
        for name in groups:
            Group.objects.get_or_create(name=name)
            self.stdout.write(self.style.SUCCESS(f'Group "{name}" created/exists'))

        # Create Leave Types
        leave_types = [
            {'name': 'Sick Leave', 'days': 10},
            {'name': 'Casual Leave', 'days': 12},
            {'name': 'Earned Leave', 'days': 15},
        ]
        for lt in leave_types:
            LeaveType.objects.get_or_create(name=lt['name'], defaults={'days_allowed': lt['days']})
            self.stdout.write(self.style.SUCCESS(f'Leave Type "{lt["name"]}" created/exists'))
