import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

print("--- START OF EMAIL TEST ---")
try:
    send_mail(
        subject='Test Email from LMS',
        message='This is a test email to verify the ConsoleBackend is working.',
        from_email='noreply@leavemanagementsystem.com',
        recipient_list=['test@example.com'],
        fail_silently=False,
    )
    print("--- END OF EMAIL TEST ---")
    print("\nSUCCESS: Email was sent to the console successfully!")
except Exception as e:
    print(f"\nERROR: Failed to send email. Reason: {e}")
