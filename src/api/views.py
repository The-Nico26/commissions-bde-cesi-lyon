from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from api.serializers import UserSerializer, CommissionSerializer, PostSerializer
from commissions.models import Commission, Post
from users.models import User


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated]


class CommissionViewSet(viewsets.ModelViewSet):
	queryset = Commission.objects.filter(is_organization=False)
	serializer_class = CommissionSerializer
	permission_classes = [IsAuthenticated]


class PostViewSet(viewsets.ModelViewSet):
	queryset = Post.objects.filter(is_moderated=False)
	serializer_class = PostSerializer
	permission_classes = [IsAuthenticated]
