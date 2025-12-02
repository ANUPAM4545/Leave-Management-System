from django.contrib import admin
from .models import Notification, Webhook, WebhookDelivery

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'subject', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'subject', 'message']

@admin.register(Webhook)
class WebhookAdmin(admin.ModelAdmin):
    list_display = ['name', 'url', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'url']
    
@admin.register(WebhookDelivery)
class WebhookDeliveryAdmin(admin.ModelAdmin):
    list_display = ['webhook', 'event_type', 'success', 'response_status', 'delivered_at']
    list_filter = ['success', 'event_type', 'delivered_at']
    search_fields = ['webhook__name', 'event_type']
    readonly_fields = ['webhook', 'event_type', 'payload', 'response_status', 'response_body', 'delivered_at', 'success', 'error_message']

