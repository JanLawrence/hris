from apps.users.permissions import IsHROrAdmin
from rest_framework import filters, viewsets

from ..models import Employee
from ..serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsHROrAdmin]
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["employee_no", "first_name", "last_name", "email"]
    ordering_fields = ["last_name", "hire_date", "employee_no"]

    def get_queryset(self):
        qs = Employee.objects.select_related("department", "position", "reports_to")
        params = self.request.query_params

        if self.action == 'list':
            # ?status=active | inactive | all  (para sa ButtonGroup mo)
            status = params.get("status", "active")
            if status == "active":
                qs = qs.filter(is_active=True)
            elif status == "inactive":
                qs = qs.filter(is_active=False)

            # ?department=1,3  (para sa MultiSelect mo)
            if departments := params.get("department"):
                qs = qs.filter(department_id__in=departments.split(","))

            # ?employment_type=regular,probationary
            if types := params.get("employment_type"):
                qs = qs.filter(employment_type__in=types.split(","))

        return qs

    def perform_destroy(self, instance):
        # Huwag burahin ang employee record: i-deactivate lang
        instance.is_active = False
        instance.save(update_fields=["is_active"])
