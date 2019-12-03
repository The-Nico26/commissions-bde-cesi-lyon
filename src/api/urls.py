from rest_framework import routers

from api.views import UserViewSet, PostViewSet, CommissionViewSet, SocialQuesterViewSet, PostImagesViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'commissions', CommissionViewSet)
router.register(r'posts', PostViewSet)
router.register(r'social-questers', SocialQuesterViewSet)
router.register(r'post-images', PostImagesViewSet)