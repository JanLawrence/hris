from rest_framework import serializers
from uuid import uuid4
from django.db import transaction
from ..models import Employee


class EmployeeSerializer(serializers.ModelSerializer):

    # pang-display lang (read-only)
    department_name = serializers.CharField(source="department.name", read_only=True, default=None)
    position_title = serializers.CharField(source="position.title", read_only=True, default=None)
    reports_to_name = serializers.SerializerMethodField()
    employment_type_display = serializers.CharField(source="get_employment_type_display", read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id", "employee_no",
            "first_name", "middle_name", "last_name", "email", "mobile_no", "birth_date",
            "civil_status", "present_address", "permanent_address",
            "emergency_contact_name", "emergency_contact_relationship", "emergency_contact_mobile",
            "department", "department_name",
            "position", "position_title",
            "reports_to", "reports_to_name",
            "employment_type", "employment_type_display", "work_setup",
            "hire_date", "regular_date",
            "sss_no", "philhealth_no", "pagibig_no", "tin",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["employee_no", "created_at", "updated_at"]

    def get_reports_to_name(self, obj):
        m = obj.reports_to
        return f"{m.first_name} {m.last_name}" if m else None

    def validate_reports_to(self, manager):
        # Hindi tinatawag ng DRF ang model.clean(), kaya ulitin dito
        current = manager
        while current:
            if self.instance and current.pk == self.instance.pk:
                raise serializers.ValidationError("Reporting line cannot loop back to this employee.")
            current = current.reports_to
        return manager


    def create(self, validated_data):
        with transaction.atomic():
            temp_no = uuid4().hex[:20]
            employee = Employee.objects.create(employee_no=temp_no, **validated_data)

            employee.employee_no = f"EMP-{employee.pk:05d}"
            employee.save(update_fields=["employee_no"])

        return employee