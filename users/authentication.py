import logging

from django.contrib.auth.models import Group, Permission
from raven.transport import requests

from users.models import User
from users.settings import AUTH_VIACESI_TENANT_ID, AUTH_VIACESI_APP_ID, AUTH_VIACESI_APP_SECRET


class ViacesiAuthBackend:
    """
    Backend d'authentification pour la connexion d'un utilisateur depuis Viacesi
    Creation de l'utilisateur s'il n'existe pas
    """

    GET_TOKEN_URL = "https://login.microsoftonline.com/{}/oauth2/token"
    GET_TOKEN_BODY = "resource=https://graph.microsoft.com&grant_type=authorization_code&client_id={}&client_secret={}&code={}&redirect_uri={}"
    GET_USER_INFO_URL = "https://graph.microsoft.com/v1.0/me"

    def authenticate(self, request, code=None):

        if code is None or request is None:
            return None

        r = requests.post(
            self.GET_TOKEN_URL.format(AUTH_VIACESI_TENANT_ID),
            data=self.GET_TOKEN_BODY.format(
                AUTH_VIACESI_APP_ID,
                AUTH_VIACESI_APP_SECRET,
                code,
                request.build_absolute_uri("/auth/viacesi")))

        if r.status_code != 200:
            print(r.json())
            return None

        tokens_json = r.json()
        access_token = tokens_json["access_token"]

        info_r = requests.get(self.GET_USER_INFO_URL, headers={'Authorization': 'Bearer {}'.format(access_token)})

        if info_r.status_code != 200:
            print(info_r.json())
            return None

        user_info_json = info_r.json()

        currentUser = None

        try:
            currentUser = User.objects.get(viacesi_id=user_info_json["id"])
        except User.DoesNotExist:
            currentUser = User.objects.create_user(
                user_info_json["mail"],
                password=None,
                first_name=user_info_json["givenName"],
                last_name=user_info_json["surname"].capitalize(),
                viacesi_id=user_info_json["id"])

            currentUser.save()

            group, created = Group.objects.get_or_create(name="members")
            group.user_set.add(currentUser)

            if created:
                group.permissions.add([
                    Permission.objects.get_by_natural_key("users.view_full_profile")
                ])

            group.save()

            print("Created new user for email {}".format(user_info_json["mail"]))

        return currentUser

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None