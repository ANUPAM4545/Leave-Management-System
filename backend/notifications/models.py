from django.db import models
from django.conf import settings

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('EMAIL', 'Email'),
        ('SYSTEM', 'System'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='EMAIL')
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.notification_type} - {self.subject} for {self.user.username}"

class Webhook(models.Model):
    name = models.CharField(max_length=255, help_text="Webhook identifier")
    url = models.URLField(help_text="Target endpoint URL")
    secret = models.CharField(max_length=255, help_text="Secret key for HMAC signing")
    events = models.JSONField(default=list, help_text="List of events to subscribe to")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.url}"

class WebhookDelivery(models.Model):
    webhook = models.ForeignKey(Webhook, on_delete=models.CASCADE, related_name='deliveries')
    event_type = models.CharField(max_length=50)
    payload = models.JSONField()
    response_status = models.IntegerField(null=True, blank=True)
    response_body = models.TextField(blank=True)
    delivered_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-delivered_at']
    
    def __str__(self):
        status = "✓" if self.success else "✗"
        return f"{status} {self.event_type} to {self.webhook.name} at {self.delivered_at}"


