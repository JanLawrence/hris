from rest_framework.permissions import BasePermission

from .models import User


class IsHROrAdmin(BasePermission):
    def has_permission(self, request, view):
        roles = (User.Role.HR, User.Role.ADMIN)
        return request.user.is_authenticated and request.user.role in roles