import os
from django.apps import AppConfig


def check_token(key, username, permissions=None):

    if permissions is None:
        permissions = []

    from rest_framework.authtoken.models import Token
    from users.models import User

    try:
        usr = User.objects.get(
            email=username
        )
    except User.DoesNotExist:
        usr = User.objects.create(
            email=username,
            username=username
        )

    usr.user_permissions.set(permissions)
    usr.save()

    try:
        token = usr.auth_token
    except Token.DoesNotExist:
        token = Token.objects.create(
            key=key,
            user=usr
        )

    if token.key != key:
        token.delete()
        Token.objects.create(
            key=key,
            user=usr
        )


class ApiConfig(AppConfig):
    name = 'api'

    def ready(self):
        from django.contrib.auth.models import Permission

        if os.getenv("POSTS_API_TOKEN"):
            check_token(
                key=os.getenv("POSTS_API_TOKEN"),
                username="special.posts.api@localhost",
                permissions=[
                    Permission.objects.get(codename="view_commission"),
                    Permission.objects.get(codename="view_user"),
                    Permission.objects.get(codename="view_full_profile"),
                    Permission.objects.get(codename="add_post"),
                    Permission.objects.get(codename="change_post"),
                    Permission.objects.get(codename="delete_post"),
                    Permission.objects.get(codename="view_post"),
                    Permission.objects.get(codename="add_postimage"),
                    Permission.objects.get(codename="change_postimage"),
                    Permission.objects.get(codename="delete_postimage"),
                    Permission.objects.get(codename="view_postimage")
                ]
            )

        super(ApiConfig, self).ready()

