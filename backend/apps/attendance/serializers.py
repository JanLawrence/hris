from rest_framework import serializers

from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField(read_only=True)
    hours_worked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Attendance
        fields = ["id", "date", "time_in", "time_out", "employee_name", "hours_worked"]

    def get_employee_name(self, obj):
        parts = [obj.employee.first_name, obj.employee.middle_name, obj.employee.last_name]
        return " ".join(p for p in parts if p)

    def get_hours_worked(self, obj):
        if obj.time_out:
            return round((obj.time_out - obj.time_in).total_seconds() / 3600, 2)
        return None