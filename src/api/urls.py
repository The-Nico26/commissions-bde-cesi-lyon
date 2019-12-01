from rest_framework import routers

from api.views import UserViewSet, PostViewSet, CommissionViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'commissions', CommissionViewSet)
router.register(r'posts', PostViewSet)
