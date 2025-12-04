from django.db import models
from django.conf import settings

class LeaveType(models.Model):
    """
    Defines the various types of leaves available in the organization
    (e.g., Sick Leave, Casual Leave, Annual Leave).
    
    This allows HR to dynamically manage leave policies without changing code.
    """
    name = models.CharField(max_length=50)
    days_allowed = models.IntegerField(help_text="Total days allowed per year for this leave type")

    def __str__(self):
        return self.name

class LeaveRequest(models.Model):
    """
    Represents a leave application submitted by an employee.
    
    This model acts as the core state machine for the leave workflow.
    It tracks the lifecycle of a request from PENDING -> APPROVED/REJECTED.
    """
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='leaves')
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    
    # Status tracks the current state of the workflow
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Optional comment from the manager when approving/rejecting
    manager_comment = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.leave_type.name} ({self.status})"

class LeaveAuditLog(models.Model):
    """
    Immutable audit trail for all actions performed on a leave request.
    
    This is critical for compliance and transparency. It records WHO did WHAT and WHEN.
    For example, if a manager approves a leave, an entry is created here.
    """
    leave = models.ForeignKey(LeaveRequest, on_delete=models.CASCADE, related_name='audit_logs')
    action_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    # Action type (e.g., CREATED, APPROVED, REJECTED)
    action = models.CharField(max_length=50)
    
    # Snapshots of status before and after the action
    previous_status = models.CharField(max_length=20, blank=True, null=True)
    new_status = models.CharField(max_length=20, blank=True, null=True)
    
    comment = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} on {self.leave} by {self.action_by}"
