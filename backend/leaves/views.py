from rest_framework import viewsets, permissions, status, generics
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import LeaveRequest, LeaveType, LeaveAuditLog
from .serializers import LeaveRequestSerializer, LeaveTypeSerializer

class LeaveViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for managing Leave Requests.
    
    Provides standard CRUD operations plus a custom action for approval/rejection.
    Access control is handled via permission_classes and get_queryset.
    """
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filter leaves based on user role:
        - HR: Can see ALL leaves.
        - MANAGER: Can see ALL leaves when viewing details or performing actions.
        - EMPLOYEE: Can only see their OWN leaves.
        """
        user = self.request.user
        if user.role == 'HR':
            return LeaveRequest.objects.all()
        # Allow Managers to access any leave for detail views and custom actions
        if user.role == 'MANAGER' and self.action in ['retrieve', 'action']:
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Custom create logic to handle side effects:
        1. Set the user to the current logged-in user.
        2. Create an initial Audit Log entry.
        3. Trigger Email Notifications.
        4. Trigger Webhooks.
        """
        leave = serializer.save(user=self.request.user)
        # Create audit log for creation
        LeaveAuditLog.objects.create(
            leave=leave,
            action_by=self.request.user,
            action='CREATED',
            new_status='PENDING',
            comment='Leave request created'
        )
        
        # Send notification
        from notifications.utils import send_leave_created_notification
        send_leave_created_notification(leave)
        
        # Send webhook
        from notifications.webhooks import send_leave_created_webhook
        send_leave_created_webhook(leave)

    @action(detail=True, methods=['post'])
    def action(self, request, pk=None):
        """
        Custom endpoint for Managers/HR to Approve or Reject a leave.
        URL: POST /api/leaves/{id}/action/
        Body: { "action": "approve" | "reject", "comment": "..." }
        """
        leave = self.get_object()
        action_type = request.data.get('action')
        comment = request.data.get('comment', '')
        previous_status = leave.status

        # Only Managers and HR can perform actions
        if request.user.role not in ['MANAGER', 'HR']:
             return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

        new_status = None
        if action_type == 'approve':
            new_status = 'APPROVED'
        elif action_type == 'reject':
            new_status = 'REJECTED'
        else:
            return Response({'error': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)
        
        leave.status = new_status
        leave.manager_comment = comment
        leave.save()

        # Create audit log
        LeaveAuditLog.objects.create(
            leave=leave,
            action_by=request.user,
            action=action_type.upper(),
            previous_status=previous_status,
            new_status=new_status,
            comment=comment
        )
        
        # Send notification
        from notifications.utils import send_leave_status_changed_notification
        send_leave_status_changed_notification(leave, action_type, request.user)
        
        # Send webhook
        from notifications.webhooks import send_leave_status_changed_webhook
        send_leave_status_changed_webhook(leave, action_type, request.user)

        return Response(LeaveRequestSerializer(leave).data)

from django.utils import timezone
from django.db.models import Count, Q

class ManagerStatsView(APIView):
    """
    Dashboard statistics for Managers.
    Returns counts of Pending, Approved (Today), and Rejected leaves.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'MANAGER':
             return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        today = timezone.now().date()
        
        # Aggregate queries for efficiency
        stats = LeaveRequest.objects.aggregate(
            pending=Count('id', filter=Q(status='PENDING')),
            approved_today=Count('id', filter=Q(status='APPROVED', updated_at__date=today)),
            rejected_total=Count('id', filter=Q(status='REJECTED'))
        )
        
        return Response(stats)

class ManagerQueueView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'MANAGER':
            return LeaveRequest.objects.none()
            
        queryset = LeaveRequest.objects.all()
        status_param = self.request.query_params.get('status')
        
        if status_param:
            queryset = queryset.filter(status=status_param)
        else:
            # Default to PENDING if no status provided, or allow 'ALL'
            if self.request.query_params.get('all') != 'true':
                 queryset = queryset.filter(status='PENDING')
                 
        return queryset.order_by('-created_at')

class HRSummaryView(generics.ListAPIView):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'HR':
            return LeaveRequest.objects.none()
        return LeaveRequest.objects.all()

class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
