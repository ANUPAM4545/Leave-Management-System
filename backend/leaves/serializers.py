from rest_framework import serializers
from .models import LeaveType, LeaveRequest, LeaveAuditLog
from users.serializers import UserSerializer

class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = '__all__'

class LeaveAuditLogSerializer(serializers.ModelSerializer):
    action_by = UserSerializer(read_only=True)
    
    class Meta:
        model = LeaveAuditLog
        fields = '__all__'

class LeaveRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    leave_type_id = serializers.PrimaryKeyRelatedField(
        queryset=LeaveType.objects.all(), source='leave_type', write_only=True
    )
    leave_type = LeaveTypeSerializer(read_only=True)
    audit_logs = LeaveAuditLogSerializer(many=True, read_only=True)

    class Meta:
        model = LeaveRequest
        fields = '__all__'
