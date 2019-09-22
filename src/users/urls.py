from django.urls import path

from users import views

urlpatterns = [
    path("login", views.auth, name="index"),
    path("auth/viacesi", views.auth_callback, name="viacesi-auth"),
    path("logout", views.logoutView, name="logout")
]