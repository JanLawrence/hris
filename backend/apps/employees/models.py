from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

class Position(models.Model):
    title = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

class Employee(models.Model):

    class CivilStatus(models.TextChoices):
        SINGLE = "single", "Single"
        MARRIED = "married", "Married"
        DIVORCED = "divorced", "Divorced"
        SEPARATED = "separated", "Separated"
        WIDOWED = "widowed", "Widowed"

    class EmploymentType(models.TextChoices):
        REGULAR = "regular", "Regular"
        PROBATIONARY = "probationary", "Probationary"
        CONTRACTUAL = "contractual", "Contractual"
        PART_TIME = "part_time", "Part-time"

    class WorkSetup(models.TextChoices):
        ONSITE = "onsite", "Onsite"
        WFH = "wfh", "Work from home"
        HYBRID = "hybrid", "Hybrid"


    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employee",
    )
    reports_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="direct_reports",
    )
    position = models.ForeignKey(
        Position,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="employees",
    )
    department = models.ForeignKey(
        Department,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="employees",
    )
    employee_no = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    birth_date = models.DateField()
    mobile_no = models.CharField(max_length=20, blank=True)
    hire_date = models.DateField()
    regular_date = models.DateField(null=True, blank=True)
    civil_status = models.CharField(max_length=20, choices=CivilStatus.choices, default=CivilStatus.SINGLE)
    present_address = models.TextField(blank=True)
    permanent_address = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=150, blank=True)
    emergency_contact_relationship = models.CharField(max_length=50, blank=True)
    emergency_contact_mobile = models.CharField(max_length=20, blank=True)
    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
        default=EmploymentType.PROBATIONARY,
    )
    work_setup = models.CharField(
        max_length=10,
        choices=WorkSetup.choices,
        default=WorkSetup.ONSITE,
    )
    sss_no = models.CharField(max_length=20, blank=True)
    philhealth_no = models.CharField(max_length=20, blank=True)
    pagibig_no = models.CharField(max_length=20, blank=True)
    tin = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self):
        return f"{self.employee_no} - {self.first_name} {self.last_name}"

    def clean(self):
        manager = self.reports_to
        while manager:
            if manager.pk == self.pk:
                raise ValidationError({"reports_to": "Reporting line cannot loop back to this employee."})
            manager = manager.reports_to
