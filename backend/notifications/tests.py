from django.test import TestCase
from django.contrib.auth import get_user_model
from notifications.models import Webhook, WebhookDelivery, Notification
from leaves.models import LeaveType, LeaveRequest
from notifications.webhooks import generate_signature, send_webhook
from datetime import date, timedelta
import json

User = get_user_model()


class TestWebhookSignature(TestCase):
    """Test HMAC signature generation."""
    
    def test_generate_signature(self):
        """Test HMAC signature is generated correctly."""
        payload = {'test': 'data'}
        secret = 'test-secret'
        
        signature = generate_signature(payload, secret)
        
        self.assertIsNotNone(signature)
        self.assertEqual(len(signature), 64)  # SHA256 hex digest length
    
    def test_signature_consistency(self):
        """Test same payload generates same signature."""
        payload = {'test': 'data', 'number': 123}
        secret = 'test-secret'
        
        sig1 = generate_signature(payload, secret)
        sig2 = generate_signature(payload, secret)
        
        self.assertEqual(sig1, sig2)


class TestWebhookDelivery(TestCase):
    """Test webhook delivery system."""
    
    def setUp(self):
        self.webhook = Webhook.objects.create(
            name='Test Webhook',
            url='https://httpbin.org/post',
            secret='test-secret-key',
            events=['test_event'],
            is_active=True
        )
    
    def test_webhook_delivery_tracked(self):
        """Test webhook delivery is tracked in database."""
        payload = {
            'event': 'test_event',
            'data': {'test': 'value'}
        }
        
        send_webhook('test_event', payload)
        
        deliveries = WebhookDelivery.objects.filter(webhook=self.webhook)
        self.assertEqual(deliveries.count(), 1)
        
        delivery = deliveries.first()
        self.assertEqual(delivery.event_type, 'test_event')
        self.assertEqual(delivery.payload, payload)
    
    def test_inactive_webhook_not_triggered(self):
        """Test inactive webhooks are not triggered."""
        self.webhook.is_active = False
        self.webhook.save()
        
        payload = {'event': 'test_event'}
        send_webhook('test_event', payload)
        
        deliveries = WebhookDelivery.objects.filter(webhook=self.webhook)
        self.assertEqual(deliveries.count(), 0)
    
    def test_webhook_only_triggered_for_subscribed_events(self):
        """Test webhook only triggered for subscribed events."""
        payload = {'event': 'other_event'}
        send_webhook('other_event', payload)
        
        deliveries = WebhookDelivery.objects.filter(webhook=self.webhook)
        self.assertEqual(deliveries.count(), 0)


class TestNotifications(TestCase):
    """Test notification system."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='test123',
            role='EMPLOYEE'
        )
    
    def test_create_notification(self):
        """Test creating a notification."""
        notification = Notification.objects.create(
            user=self.user,
            notification_type='EMAIL',
            subject='Test Subject',
            message='Test message'
        )
        
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.is_read, False)
        self.assertIsNotNone(notification.created_at)
