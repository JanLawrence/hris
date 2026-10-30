from apps.users.permissions import IsHROrAdmin

from ..models import Employee
from ..serializers import EmployeeSerializer
from ..services import create_account_for

from rest_framework import status, filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.serializers import AccountCreateSerializer, UserSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsHROrAdmin]
    serializer_class = EmployeeSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["employee_no", "first_name", "last_name", "email"]
    ordering_fields = ["last_name", "hire_date", "employee_no"]

    def get_queryset(self):
        qs = Employee.objects.select_related("department", "position", "reports_to", "user")
        params = self.request.query_params

        if self.action == 'list':
            status = params.get("status", "active")
            if status == "active":
                qs = qs.filter(is_active=True)
            elif status == "inactive":
                qs = qs.filter(is_active=False)

            if departments := params.get("department"):
                qs = qs.filter(department_id__in=departments.split(","))

            if types := params.get("employment_type"):
                qs = qs.filter(employment_type__in=types.split(","))

        return qs

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=["is_active"])

    @action(detail=True, methods=["post"])
    def account(self, request, pk=None):
        employee = self.get_object()

        if employee.user_id:
            return Response({"detail": "This employee already has an account."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AccountCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = create_account_for(employee, data)

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
