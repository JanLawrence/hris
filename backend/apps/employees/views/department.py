from django.db.models import Count, ProtectedError
from rest_framework import filters, status, viewsets
from rest_framework.response import Response
from ..models import Department
from ..serializers import DepartmentSerializer

import time

class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code"]
    ordering_fields = ["name", "code"]

    # def create(self, request, *args, **kwargs):
    #     time.sleep(2)  # TEST LANG
    #     return super().create(request, *args, **kwargs)
    def get_queryset(self):
        return Department.objects.annotate(employee_count=Count("employees"))

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "You can delete this Deparment, its still being used by employees. You can only deactivate it."},
                status=status.HTTP_400_BAD_REQUEST,
            )