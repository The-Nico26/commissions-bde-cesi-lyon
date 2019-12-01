from rest_framework import serializers

from commissions.models import Post, Commission
from users.models import User


class PostSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Post
		fields = [
			"id",
			"content",
			"source",
			"external_id",
			"author",
			"author_text",
			"commission",
			"date"
		]


class CommissionSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Commission
		fields = [
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
			"organization_dependant"
		]


class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = [
			"id",
			"email",
			"profile_picture",
			"is_active",
			"support_member"
		]