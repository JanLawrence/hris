from rest_framework import serializers

from ..models import Position


class PositionSerializer(serializers.ModelSerializer):
    employee_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Position
        fields = ["id", "title", "is_active", "employee_count"]