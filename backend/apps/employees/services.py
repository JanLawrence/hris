from django.db import transaction
from apps.users.models import User

def create_account_for(employee, data):
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
    return user
    