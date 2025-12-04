from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveViewSet, ManagerQueueView, HRSummaryView, LeaveTypeViewSet, ManagerStatsView, EmployeeStatsView

router = DefaultRouter()
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'leave-types', LeaveTypeViewSet, basename='leavetype')

urlpatterns = [
    path('employee-stats/', EmployeeStatsView.as_view(), name='employee-stats'),
    path('manager-queue/', ManagerQueueView.as_view(), name='manager-queue'),
    path('manager-stats/', ManagerStatsView.as_view(), name='manager-stats'),
    path('hr-summary/', HRSummaryView.as_view(), name='hr-summary'),
    path('', include(router.urls)),
]
