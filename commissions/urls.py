from django.urls import path

from commissions.views import list_commissions

urlpatterns = [
    path("", list_commissions, name="commission_list")
]
