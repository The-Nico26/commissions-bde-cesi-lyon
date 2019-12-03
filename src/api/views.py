from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from url_filter.integrations.drf import DjangoFilterBackend

from api.serializers import UserSerializer, CommissionSerializer, PostSerializer, SocialQuesterSerializer, \
	PostImageSerializer
from commissions.models import Commission, Post, CommissionSocialQuester, PostImage
from users.models import User


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UserSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"email",
			"support_member"
		]


class CommissionViewSet(viewsets.ModelViewSet):
	queryset = Commission.objects.all()
	serializer_class = CommissionSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"is_active",
			"name",
			"slug",
			"short_description",
			"description",
			"president",
			"treasurer",
			"deputy",
			"creation_date",
			"end_date",
			"organization_dependant",
			"social_questers",
			"is_organization"
		]



class PostViewSet(viewsets.ModelViewSet):
	queryset = Post.objects.all()
	serializer_class = PostSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"content",
			"source",
			"external_id",
			"author",
			"author_text",
			"commission",
			"date",
			"is_moderated"
		]


class SocialQuesterViewSet(viewsets.ModelViewSet):
	queryset = CommissionSocialQuester.objects.all()
	serializer_class = SocialQuesterSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
			"id",
			"commission",
			"query",
			"since_date"
		]


class PostImagesViewSet(viewsets.ModelViewSet):
	queryset = PostImage.objects.all()
	serializer_class = PostImageSerializer
	permission_classes = [IsAuthenticated]
	filter_backends = [DjangoFilterBackend]
	filter_fields = [
		"id",
		"post"
	]
