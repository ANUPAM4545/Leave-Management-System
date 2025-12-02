from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveViewSet, ManagerQueueView, HRSummaryView, LeaveTypeViewSet, ManagerStatsView

router = DefaultRouter()
router.register(r'leaves', LeaveViewSet, basename='leave')
router.register(r'leave-types', LeaveTypeViewSet, basename='leavetype')

urlpatterns = [
    path('manager-queue/', ManagerQueueView.as_view(), name='manager-queue'),
    path('manager-stats/', ManagerStatsView.as_view(), name='manager-stats'),
    path('hr-summary/', HRSummaryView.as_view(), name='hr-summary'),
    path('', include(router.urls)),
]
