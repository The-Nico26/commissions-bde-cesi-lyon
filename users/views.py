from random import randrange

from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from users.settings import AUTH_VIACESI_TENANT_ID, AUTH_VIACESI_APP_ID


def auth(request):

    state = "/"

    if "next" in request.GET:
        state = request.GET["next"]

    if request.user.is_authenticated:
        return redirect(state)

    return render(request, "auth.html", {
        "tenant_id": AUTH_VIACESI_TENANT_ID,
        "app_id": AUTH_VIACESI_APP_ID,
        "callback_url": request.build_absolute_uri("/auth/viacesi"),
        "state": state
    })


def auth_callback(request):

    if "error" in request.GET:
        if request.GET["error"] != "access_denied":
            messages.add_message(request, messages.ERROR,
                                         "Erreur lors de la connexion, veuillez rééssayer ou contacter un administrateur si le problème persiste")
            print("Authentication with viacesi failed : {}".format(request.GET["error_description"]))
        return redirect(auth)

    code = request.GET["code"]
    next = request.GET["state"]

    authenticated_user = authenticate(request, code=code)

    if authenticated_user is None:
        return redirect(auth)

    login(request, authenticated_user)
    return redirect(next)


@login_required
def logoutView(request):
    messages.add_message(request, messages.INFO, "Au revoir {}".format(request.user.first_name))
    logout(request)
    return redirect("/")
