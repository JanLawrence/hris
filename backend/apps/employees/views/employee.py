from apps.users.permissions import IsHROrAdmin

from ..models import Employee
from ..serializers import EmployeeSerializer

from django.db import transaction
from rest_framework import status, filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.models import User
from apps.users.serializers import AccountCreateSerializer, UserSerializer


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

    @action(detail=True, methods=["post"])
    def account(self, request, pk=None):
        employee = self.get_object()

        if employee.user_id:
            return Response({"detail": "This employee already has an account."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = AccountCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        with transaction.atomic():
            user = User.objects.create_user(
                username=data["username"],
                password=data["password"],
                role=data["role"],
                email=employee.email,
                first_name=employee.first_name,
                last_name=employee.last_name,
            )
            employee.user = user
            employee.save(update_fields=["user"])

        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
