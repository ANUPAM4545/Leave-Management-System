from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import LeaveType, LeaveRequest, LeaveAuditLog
from notifications.models import Notification, Webhook, WebhookDelivery
from datetime import date, timedelta

User = get_user_model()


class TestLeaveRequestModel(TestCase):
    """Test LeaveRequest model."""
    
    def setUp(self):
        self.employee = User.objects.create_user(
            username='testemployee',
            email='employee@test.com',
            password='test123',
            role='EMPLOYEE'
        )
        self.leave_type = LeaveType.objects.create(
            name='Sick Leave',
            days_allowed=10
        )
    
    def test_create_leave_request(self):
        """Test creating a leave request."""
        leave = LeaveRequest.objects.create(
            user=self.employee,
            leave_type=self.leave_type,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2),
            reason='Feeling unwell',
            status='PENDING'
        )
        self.assertEqual(leave.status, 'PENDING')
        self.assertEqual(leave.user, self.employee)
        self.assertIsNotNone(leave.created_at)


class TestLeaveCreationWorkflow(TestCase):
    """Test complete leave creation workflow including audit and notifications."""
    
    def setUp(self):
        self.client = APIClient()
        self.employee = User.objects.create_user(
            username='employee',
            email='employee@test.com',
            password='test123',
            role='EMPLOYEE'
        )
        self.manager = User.objects.create_user(
            username='manager',
            email='manager@test.com',
            password='test123',
            role='MANAGER'
        )
        self.leave_type = LeaveType.objects.create(
            name='Sick Leave',
            days_allowed=10
        )
    
    def test_employee_can_create_leave(self):
        """Test employee can create a leave request."""
        self.client.force_authenticate(user=self.employee)
        
        data = {
            'leave_type_id': self.leave_type.id,
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=2)),
            'reason': 'Medical appointment'
        }
        
        response = self.client.post('/api/leaves/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LeaveRequest.objects.count(), 1)
        
        leave = LeaveRequest.objects.first()
        self.assertEqual(leave.status, 'PENDING')
        self.assertEqual(leave.user, self.employee)
    
    def test_audit_log_created_on_leave_creation(self):
        """Test audit log is created when leave is created."""
        self.client.force_authenticate(user=self.employee)
        
        data = {
            'leave_type_id': self.leave_type.id,
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=1)),
            'reason': 'Test'
        }
        
        response = self.client.post('/api/leaves/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        leave = LeaveRequest.objects.first()
        audit_logs = LeaveAuditLog.objects.filter(leave=leave)
        
        self.assertEqual(audit_logs.count(), 1)
        self.assertEqual(audit_logs.first().action, 'CREATED')
        self.assertEqual(audit_logs.first().action_by, self.employee)
    
    def test_notification_created_on_leave_creation(self):
        """Test notification is created when leave is created."""
        self.client.force_authenticate(user=self.employee)
        
        data = {
            'leave_type_id': self.leave_type.id,
            'start_date': str(date.today()),
            'end_date': str(date.today() + timedelta(days=1)),
            'reason': 'Test'
        }
        
        response = self.client.post('/api/leaves/', data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check employee notification
        employee_notifications = Notification.objects.filter(user=self.employee)
        self.assertGreater(employee_notifications.count(), 0)
        
        # Check manager notification
        manager_notifications = Notification.objects.filter(user=self.manager)
        self.assertGreater(manager_notifications.count(), 0)


class TestLeaveApprovalWorkflow(TestCase):
    """Test leave approval workflow."""
    
    def setUp(self):
        self.client = APIClient()
        self.employee = User.objects.create_user(
            username='employee',
            email='employee@test.com',
            password='test123',
            role='EMPLOYEE'
        )
        self.manager = User.objects.create_user(
            username='manager',
            email='manager@test.com',
            password='test123',
            role='MANAGER'
        )
        self.leave_type = LeaveType.objects.create(
            name='Sick Leave',
            days_allowed=10
        )
        self.leave = LeaveRequest.objects.create(
            user=self.employee,
            leave_type=self.leave_type,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2),
            reason='Test',
            status='PENDING'
        )
    
    def test_manager_can_approve_leave(self):
        """Test manager can approve a leave request."""
        self.client.force_authenticate(user=self.manager)
        
        data = {
            'action': 'approve',
            'comment': 'Approved'
        }
        
        response = self.client.post(
            f'/api/leaves/{self.leave.id}/action/',
            data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.leave.refresh_from_db()
        self.assertEqual(self.leave.status, 'APPROVED')
        self.assertEqual(self.leave.manager_comment, 'Approved')
    
    def test_employee_cannot_approve_leave(self):
        """Test employee cannot approve a leave request."""
        self.client.force_authenticate(user=self.employee)
        
        data = {
            'action': 'approve',
            'comment': 'Approved'
        }
        
        response = self.client.post(
            f'/api/leaves/{self.leave.id}/action/',
            data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_audit_log_created_on_approval(self):
        """Test audit log is created when leave is approved."""
        self.client.force_authenticate(user=self.manager)
        
        data = {
            'action': 'approve',
            'comment': 'Looks good'
        }
        
        response = self.client.post(
            f'/api/leaves/{self.leave.id}/action/',
            data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        audit_logs = LeaveAuditLog.objects.filter(
            leave=self.leave,
            action='APPROVE'
        )
        
        self.assertEqual(audit_logs.count(), 1)
        self.assertEqual(audit_logs.first().action_by, self.manager)
        self.assertEqual(audit_logs.first().previous_status, 'PENDING')
        self.assertEqual(audit_logs.first().new_status, 'APPROVED')


class TestLeaveRejectionWorkflow(TestCase):
    """Test leave rejection workflow."""
    
    def setUp(self):
        self.client = APIClient()
        self.employee = User.objects.create_user(
            username='employee',
            email='employee@test.com',
            password='test123',
            role='EMPLOYEE'
        )
        self.manager = User.objects.create_user(
            username='manager',
            email='manager@test.com',
            password='test123',
            role='MANAGER'
        )
        self.leave_type = LeaveType.objects.create(
            name='Sick Leave',
            days_allowed=10
        )
        self.leave = LeaveRequest.objects.create(
            user=self.employee,
            leave_type=self.leave_type,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2),
            reason='Test',
            status='PENDING'
        )
    
    def test_manager_can_reject_leave(self):
        """Test manager can reject a leave request."""
        self.client.force_authenticate(user=self.manager)
        
        data = {
            'action': 'reject',
            'comment': 'Not enough coverage'
        }
        
        response = self.client.post(
            f'/api/leaves/{self.leave.id}/action/',
            data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.leave.refresh_from_db()
        self.assertEqual(self.leave.status, 'REJECTED')
        self.assertEqual(self.leave.manager_comment, 'Not enough coverage')


class TestPermissions(TestCase):
    """Test role-based permissions."""
    
    def setUp(self):
        self.client = APIClient()
        self.employee = User.objects.create_user(
            username='employee',
            email='employee@test.com',
            password='test123',
            role='EMPLOYEE'
        )
        self.other_employee = User.objects.create_user(
            username='other',
            email='other@test.com',
            password='test123',
            role='EMPLOYEE'
        )
        self.leave_type = LeaveType.objects.create(
            name='Sick Leave',
            days_allowed=10
        )
        self.leave = LeaveRequest.objects.create(
            user=self.employee,
            leave_type=self.leave_type,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=2),
            reason='Test',
            status='PENDING'
        )
    
    def test_employee_can_only_see_own_leaves(self):
        """Test employee can only see their own leave requests."""
        self.client.force_authenticate(user=self.other_employee)
        
        response = self.client.get('/api/leaves/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
    
    def test_unauthenticated_user_cannot_access(self):
        """Test unauthenticated users cannot access leaves."""
        response = self.client.get('/api/leaves/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
