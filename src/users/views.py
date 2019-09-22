from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from src.bdecesi.keys import AUTH_VIACESI_TENANT_ID, AUTH_VIACESI_APP_ID


def auth(request):

    state = "/"

    if "next" in request.GET:
        state = request.GET["next"]

    if request.user.is_authenticated:
        return redirect(state)

    return redirect(
        "https://login.microsoftonline.com/{}/oauth2/authorize?client_id={}&response_type=code&redirect_uri={}&response_mode=query&state={}".format(
            AUTH_VIACESI_TENANT_ID,
            AUTH_VIACESI_APP_ID,
            request.build_absolute_uri("/auth/viacesi"),
            state))


def auth_callback(request):

    next = request.GET["state"]

    if "error" in request.GET:
        if request.GET["error"] != "access_denied":
            messages.add_message(request, messages.ERROR,
                                         "Erreur lors de la connexion, veuillez rééssayer ou contacter un administrateur si le problème persiste")
            print("Authentication with viacesi failed : {}".format(request.GET["error_description"]))
        return redirect(next)

    code = request.GET["code"]

    authenticated_user = authenticate(request, code=code)

    if authenticated_user is None:
        return redirect("/")

    login(request, authenticated_user)
    return redirect(next)


@login_required
def logoutView(request):
    messages.add_message(request, messages.SUCCESS, "À bientôt {}".format(request.user.first_name))
    logout(request)
    return redirect("/")
