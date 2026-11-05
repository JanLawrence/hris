from apps.users.permissions import IsHROrAdmin
from rest_framework import filters, viewsets
from .models import Attendance
from .serializers import AttendanceSerializer
from apps.users.models import User
class AttendanceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AttendanceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["employee__first_name", "employee__last_name", "employee__employee_no"]
    ordering_fields = ["date", "time_in", "employee__last_name"]


    def get_queryset(self):
        qs = Attendance.objects.select_related("employee")
        user = self.request.user

        # if HR or admin, request all attendance
        if self.request.query_params.get("scope") == "all" and user.role in [User.Role.HR, User.Role.ADMIN]:
            return qs

        # if user has no employee, return empty
        employee = getattr(user, "employee", None)
        if employee is None:
            return Attendance.objects.none()

        # if user has employee, return attendance for that employee
        return qs.filter(employee=employee)