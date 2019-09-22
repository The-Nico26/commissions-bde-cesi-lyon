from django.urls import path

from src.index import views

urlpatterns = [
    path("", views.index, name="index")
]