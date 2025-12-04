from django.core.mail import send_mail
from django.conf import settings
from .models import Notification

"""
Utility functions for sending email notifications.
These functions decouple the email sending logic from the views,
making the code cleaner and easier to test.
"""

def send_leave_created_notification(leave_request):
    """Send notification when a new leave request is created."""
    # Notify the employee
    employee_subject = "Leave Request Submitted"
    employee_message = f"""
Hello {leave_request.user.get_full_name() or leave_request.user.username},

Your leave request has been successfully submitted.

Details:
- Leave Type: {leave_request.leave_type.name}
- Start Date: {leave_request.start_date}
- End Date: {leave_request.end_date}
- Reason: {leave_request.reason}
- Status: {leave_request.status}

You will be notified once your manager reviews your request.

Best regards,
Leave Management System
    """
    
    # Send email to employee
    send_mail(
        subject=employee_subject,
        message=employee_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[leave_request.user.email],
        fail_silently=True,
    )
    
    # Create notification record
    Notification.objects.create(
        user=leave_request.user,
        notification_type='EMAIL',
        subject=employee_subject,
        message=employee_message,
    )
    
    # Notify managers (get all users with MANAGER role)
    from users.models import CustomUser
    managers = CustomUser.objects.filter(role='MANAGER')
    
    for manager in managers:
        manager_subject = "New Leave Request Pending"
        manager_message = f"""
Hello {manager.get_full_name() or manager.username},

A new leave request has been submitted and requires your review.

Employee: {leave_request.user.get_full_name() or leave_request.user.username}
Leave Type: {leave_request.leave_type.name}
Start Date: {leave_request.start_date}
End Date: {leave_request.end_date}
Reason: {leave_request.reason}

Please log in to review and approve/reject this request.

Best regards,
Leave Management System
        """
        
        send_mail(
            subject=manager_subject,
            message=manager_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[manager.email],
            fail_silently=True,
        )
        
        Notification.objects.create(
            user=manager,
            notification_type='EMAIL',
            subject=manager_subject,
            message=manager_message,
        )


def send_leave_status_changed_notification(leave_request, action, manager):
    """Send notification when leave status is changed (approved/rejected)."""
    action_text = "approved" if action == 'approve' else "rejected"
    
    subject = f"Leave Request {action_text.capitalize()}"
    message = f"""
Hello {leave_request.user.get_full_name() or leave_request.user.username},

Your leave request has been {action_text} by {manager.get_full_name() or manager.username}.

Details:
- Leave Type: {leave_request.leave_type.name}
- Start Date: {leave_request.start_date}
- End Date: {leave_request.end_date}
- Status: {leave_request.status}
- Manager Comment: {leave_request.manager_comment or 'No comment provided'}

Best regards,
Leave Management System
    """
    
    # Send email
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[leave_request.user.email],
        fail_silently=True,
    )
    
    # Create notification record
    Notification.objects.create(
        user=leave_request.user,
        notification_type='EMAIL',
        subject=subject,
        message=message,
    )
