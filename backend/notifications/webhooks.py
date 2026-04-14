import hmac
import hashlib
import json
import requests
from django.utils import timezone
from .models import Webhook, WebhookDelivery

def generate_signature(payload, secret):
    """Generate HMAC SHA256 signature for webhook payload."""
    message = json.dumps(payload, sort_keys=True).encode('utf-8')
    signature = hmac.new(
        secret.encode('utf-8'),
        message,
        hashlib.sha256
    ).hexdigest()
    return signature

def send_webhook(event_type, payload):
    """
    Send webhook to all active webhooks subscribed to the event type.
    
    Args:
        event_type: Type of event (e.g., 'leave_created', 'leave_approved')
        payload: Dictionary containing event data
    """
    # Get all active webhooks and filter in Python (SQLite doesn't support contains on JSONField)
    all_webhooks = Webhook.objects.filter(is_active=True)
    webhooks = [w for w in all_webhooks if event_type in w.events]
    
    for webhook in webhooks:
        delivery = WebhookDelivery.objects.create(
            webhook=webhook,
            event_type=event_type,
            payload=payload
        )
        
        try:
            # Generate HMAC signature
            signature = generate_signature(payload, webhook.secret)
            
            # Prepare headers
            headers = {
                'Content-Type': 'application/json',
                'X-Webhook-Signature': signature,
                'X-Webhook-Event': event_type,
                'User-Agent': 'LeaveManagementSystem-Webhook/1.0'
            }
            
            # Send POST request
            response = requests.post(
                webhook.url,
                json=payload,
                headers=headers,
                timeout=10
            )
            
            # Update delivery record
            delivery.response_status = response.status_code
            delivery.response_body = response.text[:1000]  # Limit to 1000 chars
            delivery.success = 200 <= response.status_code < 300
            delivery.save()
            
        except requests.exceptions.Timeout:
            delivery.error_message = "Request timeout"
            delivery.success = False
            delivery.save()
            
        except requests.exceptions.RequestException as e:
            delivery.error_message = str(e)[:500]
            delivery.success = False
            delivery.save()
            
        except Exception as e:
            delivery.error_message = f"Unexpected error: {str(e)[:500]}"
            delivery.success = False
            delivery.save()

def send_leave_created_webhook(leave_request):
    """Send webhook when a leave request is created."""
    payload = {
        'event': 'leave_created',
        'timestamp': timezone.now().isoformat(),
        'data': {
            'leave_id': leave_request.id,
            'employee': {
                'id': leave_request.user.id,
                'username': leave_request.user.username,
                'email': leave_request.user.email,
                'name': leave_request.user.get_full_name() or leave_request.user.username
            },
            'leave_type': leave_request.leave_type.name,
            'start_date': str(leave_request.start_date),
            'end_date': str(leave_request.end_date),
            'reason': leave_request.reason,
            'status': leave_request.status,
            'created_at': leave_request.created_at.isoformat()
        }
    }
    send_webhook('leave_created', payload)

def send_leave_status_changed_webhook(leave_request, action, manager):
    """Send webhook when leave status changes (approved/rejected)."""
    event_type = f'leave_{action}d'  # 'leave_approved' or 'leave_rejected'
    
    payload = {
        'event': event_type,
        'timestamp': timezone.now().isoformat(),
        'data': {
            'leave_id': leave_request.id,
            'employee': {
                'id': leave_request.user.id,
                'username': leave_request.user.username,
                'email': leave_request.user.email,
                'name': leave_request.user.get_full_name() or leave_request.user.username
            },
            'leave_type': leave_request.leave_type.name,
            'start_date': str(leave_request.start_date),
            'end_date': str(leave_request.end_date),
            'reason': leave_request.reason,
            'status': leave_request.status,
            'manager': {
                'id': manager.id,
                'username': manager.username,
                'name': manager.get_full_name() or manager.username
            },
            'manager_comment': leave_request.manager_comment,
            'updated_at': leave_request.updated_at.isoformat()
        }
    }
    send_webhook(event_type, payload)
