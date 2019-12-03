from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from commissions.models import Post, Commission, CommissionSocialQuester, PostImage
from users.models import User


class PostSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Post
		fields = [
			"url",
			"id",
			"content",
			"source",
			"external_id",
			"author",
			"author_text",
			"author_image",
			"commission",
			"date",
			"is_moderated",
			"images"
		]


class PostImageSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = PostImage
		fields = [
			"url",
			"id",
			"post",
			"image"
		]


class CommissionSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Commission
		fields = [
			"url",
			"id",
			"is_active",
			"name",
			"slug",
			"short_description",
			"description",
			"logo",
			"banner",
			"president",
			"treasurer",
			"deputy",
			"creation_date",
			"end_date",
			"organization_dependant",
			"social_questers",
			"is_organization"
		]


class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = [
			"url",
			"id",
			"email",
			"profile_picture",
			"is_active",
			"support_member"
		]


class SocialQuesterSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = CommissionSocialQuester
		fields = [
			"url",
			"id",
			"commission",
			"query",
			"since_date",
			"commission_id"
		]