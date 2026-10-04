from rest_framework.routers import DefaultRouter

from .views import DepartmentViewSet
from .views import PositionViewSet

router = DefaultRouter()
router.register("departments", DepartmentViewSet, basename="department")
router.register("positions", PositionViewSet, basename="position")

urlpatterns = router.urls