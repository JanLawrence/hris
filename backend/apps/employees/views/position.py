from django.db.models import Count, ProtectedError
from rest_framework import filters, status, viewsets
from rest_framework.response import Response
from ..models import Position
from ..serializers import PositionSerializer

import time

class PositionViewSet(viewsets.ModelViewSet):
    serializer_class = PositionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["title"]

    def get_queryset(self):
        return Position.objects.annotate(employee_count=Count("employees"))

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "You can delete this Position, its still being used by employees. You can only deactivate it."},
                status=status.HTTP_400_BAD_REQUEST,
            )