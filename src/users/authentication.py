import logging
import os
import re

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
from raven.transport import requests
from django.contrib import messages

from commissions.models import Commission
from users.models import User
from bdecesi.keys import AUTH_VIACESI_TENANT_ID, AUTH_VIACESI_APP_ID, AUTH_VIACESI_APP_SECRET

logger = logging.getLogger(__name__)

class ViacesiAuthBackend:
    """
    Backend d'authentification pour la connexion d'un utilisateur depuis Viacesi
    Creation de l'utilisateur s'il n'existe pas
    """

    GET_TOKEN_URL = "https://login.microsoftonline.com/{}/oauth2/token"
    GET_TOKEN_BODY = "resource=https://graph.microsoft.com&grant_type=authorization_code&client_id={}&client_secret={}&code={}&redirect_uri={}"
    GET_USER_INFO_URL = "https://graph.microsoft.com/v1.0/me"
    GET_USER_PICTURE_URL = "https://graph.microsoft.com/v1.0/me/photo/$value"

    def authenticate(self, request, code=None):

        if code is None or request is None:
            return None

        if os.getenv("ENVIRONMENT", "production") == "production":
            redirection = request.build_absolute_uri("/auth/viacesi").replace("http://", "https://")
        else:
            redirection = request.build_absolute_uri("/auth/viacesi")

        logger.info("Usage of Viacesi Authentication")

        r = requests.post(
            self.GET_TOKEN_URL.format(AUTH_VIACESI_TENANT_ID),
            data=self.GET_TOKEN_BODY.format(
                AUTH_VIACESI_APP_ID,
                AUTH_VIACESI_APP_SECRET,
                code,
                redirection))

        if r.status_code != 200:
            logger.error("Can't get token")
            logger.error(r.json())
            return None

        tokens_json = r.json()
        access_token = tokens_json["access_token"]

        info_r = requests.get(self.GET_USER_INFO_URL, headers={'Authorization': 'Bearer {}'.format(access_token)})

        if info_r.status_code != 200:
            logger.error("Can't get user info")
            logger.error(r.json())
            return None

        user_info_json = info_r.json()

        currentUser = None

        picture_r = requests.get(self.GET_USER_PICTURE_URL,
                                 headers={'Authorization': 'Bearer {}'.format(access_token)})

        givenName = user_info_json["givenName"] if user_info_json["givenName"] is not None else ""
        lastName = user_info_json["surname"].capitalize() if user_info_json["surname"] is not None else ""

        if givenName == "" or lastName == "" and "displayName" in user_info_json:
            splitted = re.split(r' ', user_info_json["displayName"], 1)
            if lastName == "":
                lastName = splitted[0].capitalize()
            if givenName == "":
                givenName = splitted[1]

        print(user_info_json)
        print("Given name : {}; Last name : {}".format(givenName, lastName))

        try:
            currentUser = User.objects.get(viacesi_id=user_info_json["id"])
            currentUser.first_name = givenName
            currentUser.last_name = lastName
            if picture_r.status_code == 200:
                if currentUser.profile_picture is not None:
                    currentUser.profile_picture.delete(save=True)
                currentUser.profile_picture.save(
                    "{}.png".format(user_info_json["id"]),
                    ContentFile(picture_r.content),
                    save=True)
            currentUser.save()
            messages.add_message(request, messages.SUCCESS, "Bon retour {} !".format(currentUser.first_name))

        except User.DoesNotExist:
            currentUser = User.objects.create_user(
                user_info_json["mail"],
                password=None,
                username=user_info_json["mail"],
                first_name=givenName,
                last_name=lastName,
                viacesi_id=user_info_json["id"])

            if picture_r.status_code == 200:
                currentUser.profile_picture.save(
                    "{}.png".format(user_info_json["id"]),
                    ContentFile(picture_r.content),
                    save=True)

            currentUser.save()
            messages.add_message(request, messages.SUCCESS, "Bienvenue {} !".format(currentUser.first_name))

            group, created = Group.objects.get_or_create(name="members")
            group.user_set.add(currentUser)

            if created:
                user_ct = ContentType.objects.get_for_model(User)
                group.permissions.add(Permission.objects.get(
                        codename="view_full_profile",
                        content_type=user_ct
                    ))
                commission_ct = ContentType.objects.get_for_model(Commission)
                group.permissions.add(Permission.objects.get(
                        codename="add_commission",
                        content_type=commission_ct
                    ))
                group.permissions.add(Permission.objects.get(
                        codename="view_commission",
                        content_type=commission_ct
                    ))

            group.save()

            logger.info("Created new user for email {}".format(user_info_json["mail"]))

        return currentUser

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None