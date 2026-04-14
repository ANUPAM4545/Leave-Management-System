from django.core.management.base import BaseCommand
from leaves.models import LeaveType

class Command(BaseCommand):
    help = 'Seeds the database with default leave types'

    def handle(self, *args, **kwargs):
        defaults = [
            {'name': 'Sick Leave', 'days_allowed': 12},
            {'name': 'Casual Leave', 'days_allowed': 10},
            {'name': 'Annual Leave', 'days_allowed': 20},
            {'name': 'Maternity Leave', 'days_allowed': 90},
            {'name': 'Paternity Leave', 'days_allowed': 7},
        ]
        
        for item in defaults:
            obj, created = LeaveType.objects.get_or_create(
                name=item['name'],
                defaults={'days_allowed': item['days_allowed']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created leave type: {item["name"]}'))
            else:
                self.stdout.write(self.style.WARNING(f'Leave type already exists: {item["name"]}'))
